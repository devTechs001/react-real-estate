import natural from 'natural';
import compromise from 'compromise';
import { franc } from 'franc';
import translate from '@vitalets/google-translate-api';
import Sentiment from 'sentiment';

class NLPService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.sentiment = new Sentiment();
    this.tfidf = new natural.TfIdf();
    this.classifier = new natural.BayesClassifier();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Train classifier with sample data
      await this.trainClassifier();
      this.initialized = true;
      console.log('NLP service initialized');
    } catch (error) {
      console.error('Failed to initialize NLP service:', error);
    }
  }

  async trainClassifier() {
    // Train for property type classification
    const trainingData = [
      { text: 'spacious apartment with city view', category: 'apartment' },
      { text: 'cozy house with garden', category: 'house' },
      { text: 'luxury villa with pool', category: 'villa' },
      { text: 'modern condo downtown', category: 'condo' },
      { text: 'beachfront property with ocean view', category: 'luxury' },
      { text: 'affordable starter home', category: 'budget' },
      { text: 'investment opportunity high roi', category: 'investment' },
      { text: 'family home near schools', category: 'family' }
    ];
    
    trainingData.forEach(item => {
      this.classifier.addDocument(item.text, item.category);
    });
    
    this.classifier.train();
  }

  async extractKeywords(text, limit = 10) {
    await this.initialize();
    
    try {
      // Tokenize and clean text
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const stopWords = this.getStopWords();
      const filteredTokens = tokens.filter(token => 
        !stopWords.includes(token) && token.length > 2
      );
      
      // Calculate TF-IDF scores
      this.tfidf.addDocument(filteredTokens.join(' '));
      
      const keywords = [];
      this.tfidf.listTerms(0).forEach(item => {
        keywords.push({
          word: item.term,
          score: item.tfidf,
          stem: this.stemmer.stem(item.term)
        });
      });
      
      // Sort by score and limit
      keywords.sort((a, b) => b.score - a.score);
      
      // Extract entities using compromise
      const doc = compromise(text);
      const places = doc.places().out('array');
      const organizations = doc.organizations().out('array');
      const values = doc.values().out('array');
      
      return {
        keywords: keywords.slice(0, limit),
        entities: {
          places,
          organizations,
          values
        },
        topics: this.extractTopics(text)
      };
    } catch (error) {
      console.error('Keyword extraction error:', error);
      throw new Error('Failed to extract keywords');
    }
  }

  getStopWords() {
    return [
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was',
      'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'can', 'could',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
      'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
      'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
      'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
      'than', 'too', 'very', 'just', 'in', 'out', 'on', 'off', 'over',
      'under', 'again', 'further', 'then', 'once'
    ];
  }

  extractTopics(text) {
    const doc = compromise(text);
    
    const topics = [];
    
    // Real estate specific topic extraction
    if (text.toLowerCase().includes('investment')) topics.push('investment');
    if (text.toLowerCase().includes('luxury')) topics.push('luxury');
    if (text.toLowerCase().includes('affordable')) topics.push('budget-friendly');
    if (text.toLowerCase().includes('family')) topics.push('family-oriented');
    if (text.toLowerCase().includes('modern')) topics.push('modern');
    if (text.toLowerCase().includes('historic')) topics.push('historic');
    if (text.toLowerCase().includes('renovated')) topics.push('renovated');
    
    // Location-based topics
    if (doc.match('#Place').found) topics.push('location-specific');
    if (text.toLowerCase().includes('downtown')) topics.push('urban');
    if (text.toLowerCase().includes('suburb')) topics.push('suburban');
    if (text.toLowerCase().includes('rural')) topics.push('rural');
    
    return topics;
  }

  async analyzeSentiment(text) {
    try {
      const result = this.sentiment.analyze(text);
      
      // Detailed sentiment analysis
      const sentences = text.split(/[.!?]+/);
      const sentenceSentiments = sentences.map(sentence => ({
        text: sentence.trim(),
        sentiment: this.sentiment.analyze(sentence)
      }));
      
      // Calculate aspect-based sentiment
      const aspects = this.extractAspects(text);
      const aspectSentiments = {};
      
      aspects.forEach(aspect => {
        const aspectContext = this.extractContext(text, aspect, 50);
        aspectSentiments[aspect] = this.sentiment.analyze(aspectContext);
      });
      
      return {
        overall: {
          score: result.score,
          comparative: result.comparative,
          sentiment: result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral',
          confidence: Math.abs(result.comparative)
        },
        sentences: sentenceSentiments,
        aspects: aspectSentiments,
        positiveWords: result.positive,
        negativeWords: result.negative,
        emotions: this.detectEmotions(text)
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  extractAspects(text) {
    const aspects = [];
    const aspectKeywords = {
      location: ['location', 'area', 'neighborhood', 'district'],
      price: ['price', 'cost', 'expensive', 'affordable', 'cheap'],
      size: ['size', 'spacious', 'small', 'large', 'compact'],
      condition: ['condition', 'new', 'old', 'renovated', 'maintained'],
      amenities: ['amenities', 'features', 'facilities', 'pool', 'gym']
    };
    
    const lowerText = text.toLowerCase();
    
    Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        aspects.push(aspect);
      }
    });
    
    return aspects;
  }

  extractContext(text, word, windowSize = 50) {
    const index = text.toLowerCase().indexOf(word.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - windowSize);
    const end = Math.min(text.length, index + word.length + windowSize);
    
    return text.substring(start, end);
  }

  detectEmotions(text) {
    const emotions = {
      joy: 0,
      trust: 0,
      fear: 0,
      surprise: 0,
      sadness: 0,
      disgust: 0,
      anger: 0,
      anticipation: 0
    };
    
    // Emotion lexicon (simplified)
    const emotionWords = {
      joy: ['happy', 'joy', 'pleased', 'delighted', 'excited'],
      trust: ['trust', 'reliable', 'secure', 'safe', 'confident'],
      fear: ['fear', 'afraid', 'worried', 'concerned', 'anxious'],
      surprise: ['surprise', 'amazing', 'unexpected', 'stunning'],
      sadness: ['sad', 'disappointed', 'unfortunate', 'regret'],
      disgust: ['disgust', 'awful', 'terrible', 'horrible'],
      anger: ['angry', 'frustrated', 'annoyed', 'furious'],
      anticipation: ['excited', 'looking forward', 'eager', 'hopeful']
    };
    
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    tokens.forEach(token => {
      Object.entries(emotionWords).forEach(([emotion, words]) => {
        if (words.includes(token)) {
          emotions[emotion]++;
        }
      });
    });
    
    // Normalize scores
    const total = Object.values(emotions).reduce((a, b) => a + b, 0) || 1;
    Object.keys(emotions).forEach(emotion => {
      emotions[emotion] = emotions[emotion] / total;
    });
    
    return emotions;
  }

  async classifyText(text) {
    await this.initialize();
    
    try {
      const classification = this.classifier.classify(text);
      const classifications = this.classifier.getClassifications(text);
      
      return {
        category: classification,
        confidence: classifications[0].value,
        alternatives: classifications.slice(1, 3).map(c => ({
          category: c.label,
          confidence: c.value
        }))
      };
    } catch (error) {
      console.error('Text classification error:', error);
      throw new Error('Failed to classify text');
    }
  }

  async detectLanguage(text) {
    try {
      const langCode = franc(text);
      
      return {
        code: langCode,
        language: this.getLanguageName(langCode),
        confidence: langCode !== 'und' ? 0.8 : 0
      };
    } catch (error) {
      console.error('Language detection error:', error);
      return { code: 'und', language: 'Unknown', confidence: 0 };
    }
  }

  getLanguageName(code) {
    const languages = {
      'eng': 'English',
      'spa': 'Spanish',
      'fra': 'French',
      'deu': 'German',
      'ita': 'Italian',
      'por': 'Portuguese',
      'rus': 'Russian',
      'jpn': 'Japanese',
      'kor': 'Korean',
      'cmn': 'Chinese',
      'ara': 'Arabic',
      'hin': 'Hindi',
      'und': 'Unknown'
    };
    
    return languages[code] || 'Unknown';
  }

  async translateText(text, targetLanguage = 'en') {
    try {
      const result = await translate(text, { to: targetLanguage });
      
      return {
        translatedText: result.text,
        sourceLanguage: result.from.language.iso,
        targetLanguage,
        confidence: result.from.language.confidence || 0
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  summarizeText(text, maxLength = 200) {
    try {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      if (sentences.length <= 2) return text;
      
      // Calculate sentence scores based on word frequency
      const wordFreq = {};
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const stopWords = this.getStopWords();
      
      tokens.forEach(token => {
        if (!stopWords.includes(token)) {
          wordFreq[token] = (wordFreq[token] || 0) + 1;
        }
      });
      
      const sentenceScores = sentences.map(sentence => {
        const sentTokens = this.tokenizer.tokenize(sentence.toLowerCase());
        let score = 0;
        
        sentTokens.forEach(token => {
          if (wordFreq[token]) {
            score += wordFreq[token];
          }
        });
        
        return {
          sentence: sentence.trim(),
          score: score / sentTokens.length
        };
      });
      
      // Sort by score and select top sentences
      sentenceScores.sort((a, b) => b.score - a.score);
      
      let summary = '';
      let currentLength = 0;
      
      for (const item of sentenceScores) {
        if (currentLength + item.sentence.length <= maxLength) {
          summary += item.sentence + '. ';
          currentLength += item.sentence.length;
        } else {
          break;
        }
      }
      
      return summary.trim() || sentences[0];
    } catch (error) {
      console.error('Summarization error:', error);
      return text.substring(0, maxLength);
    }
  }

  async generateTags(text) {
    const keywords = await this.extractKeywords(text, 20);
    const classification = await this.classifyText(text);
    const topics = this.extractTopics(text);
    
    const tags = new Set();
    
    // Add top keywords as tags
    keywords.keywords.slice(0, 10).forEach(kw => {
      tags.add(kw.word);
    });
    
    // Add classification as tag
    tags.add(classification.category);
    
    // Add topics as tags
    topics.forEach(topic => tags.add(topic));
    
    // Add property-specific tags
    const propertyTags = this.extractPropertyTags(text);
    propertyTags.forEach(tag => tags.add(tag));
    
    return Array.from(tags);
  }

  extractPropertyTags(text) {
    const tags = [];
    const lowerText = text.toLowerCase();
    
    // Property features
    if (lowerText.includes('pool')) tags.push('pool');
    if (lowerText.includes('garage')) tags.push('garage');
    if (lowerText.includes('garden')) tags.push('garden');
    if (lowerText.includes('balcony')) tags.push('balcony');
    if (lowerText.includes('terrace')) tags.push('terrace');
    if (lowerText.includes('parking')) tags.push('parking');
    
    // Property types
    if (lowerText.includes('apartment')) tags.push('apartment');
    if (lowerText.includes('house')) tags.push('house');
    if (lowerText.includes('villa')) tags.push('villa');
    if (lowerText.includes('condo')) tags.push('condo');
    
    // Special features
    if (lowerText.includes('sea view') || lowerText.includes('ocean view')) tags.push('sea-view');
    if (lowerText.includes('mountain view')) tags.push('mountain-view');
    if (lowerText.includes('city view')) tags.push('city-view');
    if (lowerText.includes('renovated')) tags.push('renovated');
    if (lowerText.includes('furnished')) tags.push('furnished');
    
    return tags;
  }

  detectIntent(text) {
    const intents = {
      search: ['looking for', 'searching', 'find', 'need', 'want'],
      inquiry: ['question', 'ask', 'wondering', 'curious', 'information'],
      schedule: ['schedule', 'appointment', 'viewing', 'visit', 'see'],
      price: ['price', 'cost', 'how much', 'expensive', 'afford'],
      comparison: ['compare', 'versus', 'vs', 'better', 'difference'],
      complaint: ['problem', 'issue', 'wrong', 'error', 'mistake'],
      feedback: ['feedback', 'review', 'opinion', 'experience', 'think']
    };
    
    const lowerText = text.toLowerCase();
    const detectedIntents = [];
    
    Object.entries(intents).forEach(([intent, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detectedIntents.push(intent);
      }
    });
    
    return detectedIntents.length > 0 ? detectedIntents : ['general'];
  }

  async parseAddress(text) {
    try {
      const doc = compromise(text);
      const places = doc.places().out('array');
      const numbers = doc.values().out('array');
      
      // Extract address components
      const components = {
        streetNumber: null,
        streetName: null,
        city: null,
        state: null,
        zipCode: null,
        country: null
      };
      
      // Parse ZIP code
      const zipMatch = text.match(/\b\d{5}(-\d{4})?\b/);
      if (zipMatch) {
        components.zipCode = zipMatch[0];
      }
      
      // Parse street number
      const streetNumberMatch = text.match(/^\d+\s/);
      if (streetNumberMatch) {
        components.streetNumber = streetNumberMatch[0].trim();
      }
      
      // Use places for city/state
      if (places.length > 0) {
        components.city = places[0];
        if (places.length > 1) {
          components.state = places[1];
        }
      }
      
      return {
        parsed: components,
        original: text,
        confidence: this.calculateAddressConfidence(components)
      };
    } catch (error) {
      console.error('Address parsing error:', error);
      return { parsed: {}, original: text, confidence: 0 };
    }
  }

  calculateAddressConfidence(components) {
    let score = 0;
    let total = 0;
    
    Object.entries(components).forEach(([key, value]) => {
      total++;
      if (value) score++;
    });
    
    return score / total;
  }
}

export default new NLPService();