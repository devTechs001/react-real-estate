import Sentiment from 'sentiment';

class SentimentAnalysisService {
  constructor() {
    this.sentiment = new Sentiment();
  }

  /**
   * Analyze sentiment of text
   */
  analyze(text) {
    try {
      const result = this.sentiment.analyze(text);

      return {
        score: result.score,
        comparative: result.comparative,
        sentiment: this.getSentimentLabel(result.score),
        positive: result.positive,
        negative: result.negative,
        tokens: result.tokens,
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return null;
    }
  }

  /**
   * Get sentiment label from score
   */
  getSentimentLabel(score) {
    if (score > 2) return 'very positive';
    if (score > 0) return 'positive';
    if (score === 0) return 'neutral';
    if (score > -2) return 'negative';
    return 'very negative';
  }

  /**
   * Analyze review sentiment
   */
  analyzeReview(review) {
    const analysis = this.analyze(review.comment);

    return {
      ...analysis,
      rating: review.rating,
      isConsistent: this.checkConsistency(analysis.score, review.rating),
    };
  }

  /**
   * Check if sentiment matches rating
   */
  checkConsistency(sentimentScore, rating) {
    const expectedSentiment = (rating - 3) * 2; // Convert 1-5 rating to sentiment scale
    const difference = Math.abs(sentimentScore - expectedSentiment);
    return difference < 3; // Allow some variance
  }

  /**
   * Analyze multiple reviews
   */
  analyzeMultipleReviews(reviews) {
    const analyses = reviews.map((review) => this.analyzeReview(review));

    const avgScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return {
      averageScore: avgScore,
      averageRating: avgRating,
      overallSentiment: this.getSentimentLabel(avgScore),
      totalReviews: reviews.length,
      positiveCount: analyses.filter((a) => a.score > 0).length,
      negativeCount: analyses.filter((a) => a.score < 0).length,
      neutralCount: analyses.filter((a) => a.score === 0).length,
    };
  }

  /**
   * Extract common themes from reviews
   */
  extractThemes(reviews) {
    const allPositive = [];
    const allNegative = [];

    reviews.forEach((review) => {
      const analysis = this.analyze(review.comment);
      allPositive.push(...analysis.positive);
      allNegative.push(...analysis.negative);
    });

    // Count word frequencies
    const positiveFreq = this.countFrequencies(allPositive);
    const negativeFreq = this.countFrequencies(allNegative);

    return {
      positiveThemes: this.getTopWords(positiveFreq, 5),
      negativeThemes: this.getTopWords(negativeFreq, 5),
    };
  }

  /**
   * Count word frequencies
   */
  countFrequencies(words) {
    const freq = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
  }

  /**
   * Get top N words by frequency
   */
  getTopWords(frequencies, n = 5) {
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([word, count]) => ({ word, count }));
  }
}

export default new SentimentAnalysisService();
