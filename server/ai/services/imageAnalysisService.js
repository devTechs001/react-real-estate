import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import vision from '@google-cloud/vision';
import { createHash } from 'crypto';
import Property from '../../models/Property.js';

class ImageAnalysisService {
  constructor() {
    this.mobilenetModel = null;
    this.objectDetectionModel = null;
    this.visionClient = null;
    this.initialized = false;
    this.imageCache = new Map();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Load TensorFlow models
      this.mobilenetModel = await mobilenet.load();
      this.objectDetectionModel = await cocoSsd.load();
      
      // Initialize Google Vision API
      if (process.env.GOOGLE_CLOUD_KEYFILE) {
        this.visionClient = new vision.ImageAnnotatorClient({
          keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
        });
      }
      
      this.initialized = true;
      console.log('Image analysis service initialized');
    } catch (error) {
      console.error('Failed to initialize image analysis:', error);
    }
  }

  async analyzePropertyImage(imageUrl) {
    await this.initialize();
    
    try {
      // Check cache
      const cacheKey = this.generateCacheKey(imageUrl);
      if (this.imageCache.has(cacheKey)) {
        return this.imageCache.get(cacheKey);
      }

      // Download and process image
      const imageBuffer = await this.downloadImage(imageUrl);
      
      // Run multiple analyses in parallel
      const [
        quality,
        objects,
        rooms,
        features,
        authenticity,
        enhancements
      ] = await Promise.all([
        this.assessImageQuality(imageBuffer),
        this.detectObjects(imageBuffer),
        this.classifyRoom(imageBuffer),
        this.extractFeatures(imageBuffer),
        this.checkAuthenticity(imageBuffer),
        this.suggestEnhancements(imageBuffer)
      ]);

      const analysis = {
        quality,
        objects,
        rooms,
        features,
        authenticity,
        enhancements,
        metadata: await this.extractMetadata(imageBuffer),
        timestamp: new Date()
      };

      // Cache result
      this.imageCache.set(cacheKey, analysis);
      
      return analysis;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async downloadImage(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download image');
    return Buffer.from(await response.arrayBuffer());
  }

  async assessImageQuality(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const stats = await sharp(imageBuffer).stats();
      
      // Calculate quality metrics
      const resolution = metadata.width * metadata.height;
      const isHighRes = resolution >= 1920 * 1080;
      const aspectRatio = metadata.width / metadata.height;
      const isGoodAspectRatio = aspectRatio >= 1.3 && aspectRatio <= 1.8;
      
      // Check sharpness (simplified)
      const sharpness = this.calculateSharpness(stats);
      
      // Check brightness and contrast
      const brightness = this.calculateBrightness(stats);
      const contrast = this.calculateContrast(stats);
      
      // Overall quality score
      let qualityScore = 0;
      if (isHighRes) qualityScore += 30;
      if (isGoodAspectRatio) qualityScore += 20;
      if (sharpness > 0.7) qualityScore += 20;
      if (brightness > 0.3 && brightness < 0.7) qualityScore += 15;
      if (contrast > 0.4) qualityScore += 15;
      
      return {
        score: qualityScore,
        resolution: `${metadata.width}x${metadata.height}`,
        format: metadata.format,
        size: metadata.size,
        isHighQuality: qualityScore >= 70,
        metrics: {
          sharpness,
          brightness,
          contrast,
          aspectRatio
        },
        issues: this.identifyQualityIssues(qualityScore, { sharpness, brightness, contrast })
      };
    } catch (error) {
      console.error('Quality assessment error:', error);
      return { score: 0, isHighQuality: false, error: error.message };
    }
  }

  calculateSharpness(stats) {
    // Simplified sharpness calculation using channel standard deviation
    const channels = stats.channels || [];
    const avgStdDev = channels.reduce((sum, ch) => sum + (ch.stdev || 0), 0) / channels.length;
    return Math.min(avgStdDev / 100, 1);
  }

  calculateBrightness(stats) {
    const channels = stats.channels || [];
    const avgMean = channels.reduce((sum, ch) => sum + (ch.mean || 0), 0) / channels.length;
    return avgMean / 255;
  }

  calculateContrast(stats) {
    const channels = stats.channels || [];
    const avgStdDev = channels.reduce((sum, ch) => sum + (ch.stdev || 0), 0) / channels.length;
    return avgStdDev / 128;
  }

  identifyQualityIssues(score, metrics) {
    const issues = [];
    
    if (score < 30) issues.push('Very low quality image');
    if (metrics.sharpness < 0.5) issues.push('Image appears blurry');
    if (metrics.brightness < 0.2) issues.push('Image is too dark');
    if (metrics.brightness > 0.8) issues.push('Image is overexposed');
    if (metrics.contrast < 0.3) issues.push('Low contrast');
    
    return issues;
  }

  async detectObjects(imageBuffer) {
    if (!this.objectDetectionModel) return [];

    try {
      // Convert buffer to tensor
      const image = await this.bufferToTensor(imageBuffer);
      
      // Detect objects
      const predictions = await this.objectDetectionModel.detect(image);
      
      // Filter and process predictions
      const relevantObjects = this.filterRelevantObjects(predictions);
      
      // Dispose tensor
      image.dispose();
      
      return relevantObjects;
    } catch (error) {
      console.error('Object detection error:', error);
      return [];
    }
  }

  async bufferToTensor(buffer) {
    const image = await sharp(buffer)
      .resize(224, 224)
      .raw()
      .toBuffer();
    
    return tf.node.decodeImage(buffer);
  }

  filterRelevantObjects(predictions) {
    const relevantClasses = [
      'couch', 'bed', 'chair', 'dining table', 'toilet',
      'tv', 'laptop', 'microwave', 'oven', 'sink',
      'refrigerator', 'book', 'potted plant', 'vase'
    ];
    
    return predictions
      .filter(p => relevantClasses.includes(p.class) && p.score > 0.5)
      .map(p => ({
        object: p.class,
        confidence: p.score,
        location: p.bbox
      }));
  }

  async classifyRoom(imageBuffer) {
    if (!this.mobilenetModel) return null;

    try {
      const image = await this.bufferToTensor(imageBuffer);
      const predictions = await this.mobilenetModel.classify(image);
      
      // Map predictions to room types
      const roomType = this.mapToRoomType(predictions);
      
      image.dispose();
      
      return {
        type: roomType,
        confidence: predictions[0]?.probability || 0,
        alternatives: predictions.slice(1, 3).map(p => ({
          type: this.mapToRoomType([p]),
          confidence: p.probability
        }))
      };
    } catch (error) {
      console.error('Room classification error:', error);
      return null;
    }
  }

  mapToRoomType(predictions) {
    const roomKeywords = {
      bedroom: ['bedroom', 'bed', 'pillow', 'blanket'],
      kitchen: ['kitchen', 'stove', 'refrigerator', 'dining'],
      bathroom: ['bathroom', 'toilet', 'shower', 'bathtub'],
      livingRoom: ['living', 'couch', 'sofa', 'television'],
      office: ['office', 'desk', 'computer', 'workspace'],
      garage: ['garage', 'car', 'vehicle'],
      exterior: ['house', 'building', 'yard', 'garden']
    };
    
    for (const prediction of predictions) {
      const label = prediction.className.toLowerCase();
      
      for (const [room, keywords] of Object.entries(roomKeywords)) {
        if (keywords.some(keyword => label.includes(keyword))) {
          return room;
        }
      }
    }
    
    return 'unknown';
  }

  async extractFeatures(imageBuffer) {
    const features = [];
    
    try {
      // Use Google Vision API if available
      if (this.visionClient) {
        const [result] = await this.visionClient.labelDetection({
          image: { content: imageBuffer.toString('base64') }
        });
        
        if (result.labelAnnotations) {
          features.push(...result.labelAnnotations.map(label => ({
            feature: label.description,
            confidence: label.score
          })));
        }
      }
      
      // Extract color palette
      const colors = await this.extractColors(imageBuffer);
      features.push({
        feature: 'color_palette',
        value: colors
      });
      
      // Detect lighting conditions
      const lighting = await this.analyzeLighting(imageBuffer);
      features.push({
        feature: 'lighting',
        value: lighting
      });
      
      return features;
    } catch (error) {
      console.error('Feature extraction error:', error);
      return features;
    }
  }

  async extractColors(imageBuffer) {
    const { dominant } = await sharp(imageBuffer)
      .stats();
    
    return dominant;
  }

  async analyzeLighting(imageBuffer) {
    const stats = await sharp(imageBuffer).stats();
    const brightness = this.calculateBrightness(stats);
    
    if (brightness > 0.7) return 'bright';
    if (brightness > 0.4) return 'natural';
    if (brightness > 0.2) return 'dim';
    return 'dark';
  }

  async checkAuthenticity(imageBuffer) {
    try {
      const checks = {
        isOriginal: true,
        isModified: false,
        hasWatermark: false,
        isStockPhoto: false,
        duplicateFound: false,
        confidence: 0
      };
      
      // Check for modifications using metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      if (metadata.exif) {
        const exifData = metadata.exif;
        checks.isModified = this.detectModification(exifData);
      }
      
      // Check for watermarks (simplified)
      checks.hasWatermark = await this.detectWatermark(imageBuffer);
      
      // Check if it's a stock photo
      checks.isStockPhoto = await this.checkStockPhoto(imageBuffer);
      
      // Check for duplicates
      checks.duplicateFound = await this.checkDuplicates(imageBuffer);
      
      // Calculate overall confidence
      let confidence = 100;
      if (checks.isModified) confidence -= 30;
      if (checks.hasWatermark) confidence -= 20;
      if (checks.isStockPhoto) confidence -= 40;
      if (checks.duplicateFound) confidence -= 50;
      
      checks.confidence = Math.max(0, confidence);
      checks.isOriginal = confidence > 60;
      
      return checks;
    } catch (error) {
      console.error('Authenticity check error:', error);
      return { isOriginal: false, confidence: 0, error: error.message };
    }
  }

  detectModification(exifData) {
    // Check for common editing software signatures
    const editingSoftware = ['photoshop', 'gimp', 'lightroom'];
    const software = (exifData.Software || '').toLowerCase();
    
    return editingSoftware.some(editor => software.includes(editor));
  }

  async detectWatermark(imageBuffer) {
    // Simplified watermark detection
    // In production, use more sophisticated methods
    try {
      const metadata = await sharp(imageBuffer).metadata();
      // Check for text overlays or transparency
      return metadata.hasAlpha || false;
    } catch {
      return false;
    }
  }

  async checkStockPhoto(imageBuffer) {
    // Generate image hash
    const hash = this.generateImageHash(imageBuffer);
    
    // Check against known stock photo hashes (simplified)
    // In production, use reverse image search APIs
    const stockPhotoHashes = new Set([
      // Add known stock photo hashes
    ]);
    
    return stockPhotoHashes.has(hash);
  }

  async checkDuplicates(imageBuffer) {
    const hash = this.generateImageHash(imageBuffer);
    
    // Check in database for similar images
    const duplicates = await Property.find({
      'images.hash': hash
    }).countDocuments();
    
    return duplicates > 0;
  }

  generateImageHash(buffer) {
    return createHash('md5').update(buffer).digest('hex');
  }

  generateCacheKey(imageUrl) {
    return createHash('md5').update(imageUrl).digest('hex');
  }

  async suggestEnhancements(imageBuffer) {
    const suggestions = [];
    
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const stats = await sharp(imageBuffer).stats();
      
      // Resolution enhancement
      if (metadata.width < 1920 || metadata.height < 1080) {
        suggestions.push({
          type: 'upscale',
          description: 'Increase resolution for better quality',
          priority: 'high'
        });
      }
      
      // Brightness adjustment
      const brightness = this.calculateBrightness(stats);
      if (brightness < 0.3) {
        suggestions.push({
          type: 'brighten',
          description: 'Increase brightness',
          value: 1.5,
          priority: 'medium'
        });
      } else if (brightness > 0.7) {
        suggestions.push({
          type: 'darken',
          description: 'Reduce brightness',
          value: 0.8,
          priority: 'medium'
        });
      }
      
      // Contrast adjustment
      const contrast = this.calculateContrast(stats);
      if (contrast < 0.3) {
        suggestions.push({
          type: 'contrast',
          description: 'Increase contrast',
          value: 1.3,
          priority: 'medium'
        });
      }
      
      // Sharpness
      const sharpness = this.calculateSharpness(stats);
      if (sharpness < 0.5) {
        suggestions.push({
          type: 'sharpen',
          description: 'Apply sharpening filter',
          priority: 'low'
        });
      }
      
      return suggestions;
    } catch (error) {
      console.error('Enhancement suggestion error:', error);
      return suggestions;
    }
  }

  async enhanceImage(imageUrl, enhancements = []) {
    try {
      const imageBuffer = await this.downloadImage(imageUrl);
      let processedImage = sharp(imageBuffer);
      
      for (const enhancement of enhancements) {
        switch (enhancement.type) {
          case 'upscale':
            processedImage = processedImage.resize(1920, 1080, {
              fit: 'inside',
              withoutEnlargement: false
            });
            break;
            
          case 'brighten':
            processedImage = processedImage.modulate({
              brightness: enhancement.value || 1.2
            });
            break;
            
          case 'darken':
            processedImage = processedImage.modulate({
              brightness: enhancement.value || 0.8
            });
            break;
            
          case 'contrast':
            processedImage = processedImage.linear(
              enhancement.value || 1.2,
              -(128 * (enhancement.value - 1))
            );
            break;
            
          case 'sharpen':
            processedImage = processedImage.sharpen();
            break;
            
          case 'denoise':
            processedImage = processedImage.median(3);
            break;
            
          case 'auto':
            processedImage = processedImage.normalize();
            break;
        }
      }
      
      const enhancedBuffer = await processedImage.toBuffer();
      
      // Convert to base64 for response
      const base64Image = enhancedBuffer.toString('base64');
      
      return {
        enhanced: true,
        image: `data:image/jpeg;base64,${base64Image}`,
        appliedEnhancements: enhancements
      };
    } catch (error) {
      console.error('Image enhancement error:', error);
      throw new Error('Failed to enhance image');
    }
  }

  async extractMetadata(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      
      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        space: metadata.space,
        channels: metadata.channels,
        depth: metadata.depth,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation,
        exif: metadata.exif ? this.parseExif(metadata.exif) : null
      };
    } catch (error) {
      console.error('Metadata extraction error:', error);
      return null;
    }
  }

  parseExif(exifBuffer) {
    // Parse EXIF data (simplified)
    return {
      camera: 'Unknown',
      dateTaken: null,
      location: null
    };
  }

  async generateVirtualStaging(imageBuffer, roomType, style) {
    // Virtual staging using AI (placeholder for advanced implementation)
    // This would typically use GANs or diffusion models
    
    return {
      staged: false,
      message: 'Virtual staging requires advanced AI models',
      alternatives: [
        'Use professional staging services',
        'Apply furniture overlays',
        'Use 3D rendering software'
      ]
    };
  }

  async removeBackground(imageBuffer) {
    // Background removal (simplified)
    // In production, use specialized models like U-2-Net
    
    try {
      const processedImage = await sharp(imageBuffer)
        .removeAlpha()
        .toBuffer();
      
      return {
        success: true,
        image: processedImage.toString('base64')
      };
    } catch (error) {
      console.error('Background removal error:', error);
      throw new Error('Failed to remove background');
    }
  }
}

export default new ImageAnalysisService();