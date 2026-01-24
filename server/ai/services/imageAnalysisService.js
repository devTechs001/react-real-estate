import vision from '@google-cloud/vision';
import sharp from 'sharp';
import axios from 'axios';

class ImageAnalysisService {
  constructor() {
    // Initialize Google Cloud Vision client if credentials are available
    try {
      this.client = new vision.ImageAnnotatorClient();
      this.isAvailable = true;
    } catch (error) {
      console.warn('Google Cloud Vision not configured:', error.message);
      this.isAvailable = false;
    }
  }

  /**
   * Analyze property image
   */
  async analyzePropertyImage(imageUrl) {
    if (!this.isAvailable) {
      return this.basicImageAnalysis(imageUrl);
    }

    try {
      const [result] = await this.client.labelDetection(imageUrl);
      const labels = result.labelAnnotations;

      const [safeSearch] = await this.client.safeSearchDetection(imageUrl);
      const safe = safeSearch.safeSearchAnnotation;

      const [properties] = await this.client.imageProperties(imageUrl);
      const colors = properties.imagePropertiesAnnotation.dominantColors.colors;

      return {
        labels: labels.map((label) => ({
          description: label.description,
          score: label.score,
          confidence: label.score * 100,
        })),
        safeSearch: {
          adult: safe.adult,
          violence: safe.violence,
          isSafe: safe.adult === 'VERY_UNLIKELY' && safe.violence === 'VERY_UNLIKELY',
        },
        dominantColors: colors.slice(0, 5).map((color) => ({
          rgb: color.color,
          score: color.score,
          pixelFraction: color.pixelFraction,
        })),
        quality: this.assessImageQuality(labels, colors),
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return this.basicImageAnalysis(imageUrl);
    }
  }

  /**
   * Basic image analysis without Google Cloud Vision
   */
  async basicImageAnalysis(imageUrl) {
    try {
      // Download image
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Get image metadata
      const metadata = await sharp(buffer).metadata();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
        aspectRatio: (metadata.width / metadata.height).toFixed(2),
        quality: this.assessBasicQuality(metadata),
        labels: [],
        safeSearch: { isSafe: true },
      };
    } catch (error) {
      console.error('Basic image analysis error:', error);
      return null;
    }
  }

  /**
   * Assess image quality based on labels and colors
   */
  assessImageQuality(labels, colors) {
    let score = 50; // Base score

    // Check for property-related labels
    const propertyLabels = ['house', 'building', 'property', 'room', 'interior', 'exterior'];
    const hasPropertyLabels = labels.some((label) =>
      propertyLabels.some((pl) => label.description.toLowerCase().includes(pl))
    );

    if (hasPropertyLabels) score += 20;

    // Check color diversity
    if (colors && colors.length >= 3) score += 15;

    // Check label confidence
    const avgConfidence = labels.reduce((sum, l) => sum + l.score, 0) / labels.length;
    score += avgConfidence * 15;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Assess basic quality from metadata
   */
  assessBasicQuality(metadata) {
    let score = 50;

    // Resolution check
    const pixels = metadata.width * metadata.height;
    if (pixels >= 1920 * 1080) score += 25; // Full HD or better
    else if (pixels >= 1280 * 720) score += 15; // HD
    else if (pixels < 640 * 480) score -= 20; // Too low

    // Aspect ratio check (prefer 16:9 or 4:3)
    const ratio = metadata.width / metadata.height;
    if (Math.abs(ratio - 16 / 9) < 0.1 || Math.abs(ratio - 4 / 3) < 0.1) {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Detect property features in image
   */
  async detectPropertyFeatures(imageUrl) {
    if (!this.isAvailable) {
      return { features: [] };
    }

    try {
      const [result] = await this.client.objectLocalization(imageUrl);
      const objects = result.localizedObjectAnnotations;

      const propertyFeatures = objects
        .filter((obj) => obj.score > 0.5)
        .map((obj) => ({
          name: obj.name,
          confidence: obj.score * 100,
          boundingBox: obj.boundingPoly,
        }));

      return {
        features: propertyFeatures,
        count: propertyFeatures.length,
      };
    } catch (error) {
      console.error('Feature detection error:', error);
      return { features: [] };
    }
  }

  /**
   * Compare images for similarity
   */
  async compareImages(imageUrl1, imageUrl2) {
    try {
      const [analysis1, analysis2] = await Promise.all([
        this.analyzePropertyImage(imageUrl1),
        this.analyzePropertyImage(imageUrl2),
      ]);

      // Compare labels
      const labels1 = new Set(analysis1.labels.map((l) => l.description));
      const labels2 = new Set(analysis2.labels.map((l) => l.description));
      const commonLabels = [...labels1].filter((l) => labels2.has(l));
      const similarity = (commonLabels.length / Math.max(labels1.size, labels2.size)) * 100;

      return {
        similarity: similarity.toFixed(2),
        commonLabels,
        isSimilar: similarity > 50,
      };
    } catch (error) {
      console.error('Image comparison error:', error);
      return { similarity: 0, commonLabels: [], isSimilar: false };
    }
  }
}

export default new ImageAnalysisService();
