import * as tf from '@tensorflow/tfjs-node';
import Property from '../../models/Property.js';

class TensorFlowService {
  constructor() {
    this.model = null;
    this.isModelTrained = false;
  }

  /**
   * Normalize features
   */
  normalizeData(data, mean, std) {
    return data.map((row) =>
      row.map((val, idx) => (val - mean[idx]) / (std[idx] || 1))
    );
  }

  /**
   * Calculate mean and standard deviation
   */
  calculateStats(data) {
    const numFeatures = data[0].length;
    const mean = new Array(numFeatures).fill(0);
    const std = new Array(numFeatures).fill(0);

    // Calculate mean
    data.forEach((row) => {
      row.forEach((val, idx) => {
        mean[idx] += val;
      });
    });
    mean.forEach((val, idx) => {
      mean[idx] = val / data.length;
    });

    // Calculate standard deviation
    data.forEach((row) => {
      row.forEach((val, idx) => {
        std[idx] += Math.pow(val - mean[idx], 2);
      });
    });
    std.forEach((val, idx) => {
      std[idx] = Math.sqrt(val / data.length);
    });

    return { mean, std };
  }

  /**
   * Build neural network model
   */
  buildModel(inputShape) {
    const model = tf.sequential();

    // Input layer
    model.add(
      tf.layers.dense({
        units: 64,
        activation: 'relu',
        inputShape: [inputShape],
      })
    );

    // Hidden layers
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

    // Output layer
    model.add(tf.layers.dense({ units: 1 }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });

    return model;
  }

  /**
   * Train price prediction model
   */
  async trainPricePredictionModel() {
    try {
      console.log('Starting TensorFlow model training...');

      // Fetch training data
      const properties = await Property.find({
        price: { $exists: true, $gt: 0 },
        status: 'sold',
      }).limit(1000);

      if (properties.length < 50) {
        throw new Error('Insufficient training data');
      }

      // Prepare features and labels
      const features = properties.map((p) => [
        p.bedrooms || 0,
        p.bathrooms || 0,
        p.area || 0,
        p.yearBuilt || 2000,
        p.location?.coordinates?.[0] || 0,
        p.location?.coordinates?.[1] || 0,
      ]);

      const labels = properties.map((p) => p.price);

      // Normalize data
      const stats = this.calculateStats(features);
      const normalizedFeatures = this.normalizeData(features, stats.mean, stats.std);

      // Convert to tensors
      const xs = tf.tensor2d(normalizedFeatures);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      // Build and train model
      this.model = this.buildModel(features[0].length);

      await this.model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
            }
          },
        },
      });

      this.isModelTrained = true;
      this.stats = stats;

      // Cleanup tensors
      xs.dispose();
      ys.dispose();

      console.log('Model training completed');
      return { success: true, stats };
    } catch (error) {
      console.error('TensorFlow training error:', error);
      throw error;
    }
  }

  /**
   * Predict property price
   */
  async predictPrice(propertyData) {
    if (!this.isModelTrained || !this.model) {
      await this.trainPricePredictionModel();
    }

    try {
      const features = [
        propertyData.bedrooms || 0,
        propertyData.bathrooms || 0,
        propertyData.area || 0,
        propertyData.yearBuilt || 2000,
        propertyData.latitude || 0,
        propertyData.longitude || 0,
      ];

      const normalizedFeatures = this.normalizeData(
        [features],
        this.stats.mean,
        this.stats.std
      );

      const input = tf.tensor2d(normalizedFeatures);
      const prediction = this.model.predict(input);
      const price = (await prediction.data())[0];

      // Cleanup
      input.dispose();
      prediction.dispose();

      return Math.max(0, price);
    } catch (error) {
      console.error('Price prediction error:', error);
      throw error;
    }
  }
}

export default new TensorFlowService();
