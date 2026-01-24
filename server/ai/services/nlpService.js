import natural from 'natural';
import compromise from 'compromise';

class NLPService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text, limit = 10) {
    try {
      const doc = compromise(text);

      // Extract nouns and adjectives
      const nouns = doc.nouns().out('array');
      const adjectives = doc.adjectives().out('array');

      const keywords = [...new Set([...nouns, ...adjectives])];
      return keywords.slice(0, limit);
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return [];
    }
  }

  /**
   * Enhance search query with NLP
   */
  enhanceSearchQuery(query) {
    try {
      const doc = compromise(query);

      // Extract location
      const places = doc.places().out('array');

      // Extract numbers (bedrooms, price, etc.)
      const numbers = doc.numbers().out('array');

      // Extract property types
      const propertyTypes = ['apartment', 'house', 'villa', 'condo', 'townhouse'];
      const foundTypes = propertyTypes.filter((type) =>
        query.toLowerCase().includes(type)
      );

      return {
        original: query,
        locations: places,
        numbers,
        propertyTypes: foundTypes,
        keywords: this.extractKeywords(query),
      };
    } catch (error) {
      console.error('Query enhancement error:', error);
      return { original: query };
    }
  }

  /**
   * Calculate text similarity
   */
  calculateSimilarity(text1, text2) {
    try {
      const tokens1 = this.tokenizer.tokenize(text1.toLowerCase());
      const tokens2 = this.tokenizer.tokenize(text2.toLowerCase());

      const set1 = new Set(tokens1);
      const set2 = new Set(tokens2);

      const intersection = new Set([...set1].filter((x) => set2.has(x)));
      const union = new Set([...set1, ...set2]);

      return intersection.size / union.size;
    } catch (error) {
      console.error('Similarity calculation error:', error);
      return 0;
    }
  }

  /**
   * Classify property description
   */
  classifyDescription(description) {
    try {
      const doc = compromise(description);

      const features = {
        luxury: /luxury|premium|exclusive|high-end/i.test(description),
        modern: /modern|contemporary|new|renovated/i.test(description),
        spacious: /spacious|large|big|roomy/i.test(description),
        cozy: /cozy|comfortable|warm|inviting/i.test(description),
        familyFriendly: /family|kids|children|school/i.test(description),
      };

      return features;
    } catch (error) {
      console.error('Classification error:', error);
      return {};
    }
  }

  /**
   * Generate search suggestions
   */
  generateSuggestions(query, properties) {
    try {
      const enhanced = this.enhanceSearchQuery(query);
      const suggestions = [];

      // Location-based suggestions
      if (enhanced.locations && enhanced.locations.length > 0) {
        enhanced.locations.forEach((location) => {
          suggestions.push(`Properties in ${location}`);
        });
      }

      // Property type suggestions
      if (enhanced.propertyTypes && enhanced.propertyTypes.length > 0) {
        enhanced.propertyTypes.forEach((type) => {
          suggestions.push(`${type}s for sale`);
          suggestions.push(`${type}s for rent`);
        });
      }

      return suggestions.slice(0, 5);
    } catch (error) {
      console.error('Suggestion generation error:', error);
      return [];
    }
  }
}

export default new NLPService();
