import Sentiment from 'sentiment';
import natural from 'natural';
import Review from '../../models/Review.js';
import Message from '../../models/Message.js';

class SentimentAnalysisService {
  constructor() {
    this.sentiment = new Sentiment();
    this.analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    this.customLexicon = this.loadCustomLexicon();
  }

  loadCustomLexicon() {
    // Real estate specific sentiment words
    return {
      // Positive
      'spacious': 3,
      'luxurious': 4,
      'modern': 2,
      'renovated': 3,
      'convenient': 2,
      'beautiful': 3,
      'stunning': 4,
      'perfect': 4,
      'excellent': 4,
      'amazing': 4,
      'fantastic': 4,
      'wonderful': 3,
      'great': 3,
      'comfortable': 2,
      'cozy': 2,
      'charming': 2,
      'elegant': 3,
      'prestigious': 3,
      'prime': 3,
      'desirable': 2,
      
      // Negative
      'small': -1,
      'cramped': -3,
      'outdated': -2,
      'old': -1,
      'noisy': -3,
      'dirty': -3,
      'broken': -4,
      'damaged': -3,
      'poor': -3,
      'terrible': -4,
      'horrible': -4,
      'awful': -4,
      'disgusting': -4,
      'unacceptable': -3,
      'disappointing': -2,
      'overpriced': -2,
      'expensive': -1,
      'unsafe': -4,
      'dangerous': -4,
      'sketchy': -3
    };
  }

  async analyzeReviews(reviews) {
    try {
      const analyzedReviews = [];
      let totalScore = 0;
      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;
      
      for (const review of reviews) {
        const analysis = await this.analyzeText(review.comment);
        
        analyzedReviews.push({
          reviewId: review._id,
          sentiment: analysis.sentiment,
          score: analysis.score,
          confidence: analysis.confidence,
          keywords: analysis.keywords,
          aspects: analysis.aspects
        });
        
        totalScore += analysis.score;
        
        if (analysis.sentiment === 'positive') positiveCount++;
        else if (analysis.sentiment === 'negative') negativeCount++;
        else neutralCount++;
      }
      
      const avgScore = reviews.length > 0 ? totalScore / reviews.length : 0;
      const overallSentiment = avgScore > 0.5 ? 'positive' : avgScore < -0.5 ? 'negative' : 'neutral';
      
      // Extract common themes
      const themes = this.extractThemes(analyzedReviews);
      
      // Generate summary insights
      const insights = this.generateInsights(analyzedReviews, themes);
      
      return {
        overall: {
          sentiment: overallSentiment,
          score: avgScore,
          distribution: {
            positive: (positiveCount / reviews.length) * 100,
            negative: (negativeCount / reviews.length) * 100,
            neutral: (neutralCount / reviews.length) * 100
          }
        },
        reviews: analyzedReviews,
        themes,
        insights,
        timeline: this.analyzeSentimentTimeline(reviews),
        recommendations: this.generateRecommendations(analyzedReviews, themes)
      };
    } catch (error) {
      console.error('Review analysis error:', error);
      throw new Error('Failed to analyze reviews');
    }
  }

  async analyzeText(text) {
    try {
      // Basic sentiment analysis
      const result = this.sentiment.analyze(text);
      
      // Apply custom lexicon
      let customScore = 0;
      const tokens = text.toLowerCase().split(/\s+/);
      
      tokens.forEach(token => {
        if (this.customLexicon[token]) {
          customScore += this.customLexicon[token];
        }
      });
      
      // Combine scores
      const finalScore = (result.score + customScore) / 2;
      const normalizedScore = Math.tanh(finalScore / 10); // Normalize to [-1, 1]
      
      // Determine sentiment category
      let sentiment;
      if (normalizedScore > 0.2) sentiment = 'positive';
      else if (normalizedScore < -0.2) sentiment = 'negative';
      else sentiment = 'neutral';
      
      // Extract keywords
      const keywords = this.extractSentimentKeywords(text, result);
      
      // Analyze aspects
      const aspects = this.analyzeAspects(text);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(result, customScore);
      
      return {
        sentiment,
        score: normalizedScore,
        rawScore: result.score,
        customScore,
        confidence,
        keywords,
        aspects,
        positiveWords: result.positive,
        negativeWords: result.negative
      };
    } catch (error) {
      console.error('Text analysis error:', error);
      throw error;
    }
  }

  extractSentimentKeywords(text, sentimentResult) {
    const keywords = [];
    
    // Add positive words
    sentimentResult.positive.forEach(word => {
      keywords.push({ word, sentiment: 'positive', impact: 'high' });
    });
    
    // Add negative words
    sentimentResult.negative.forEach(word => {
      keywords.push({ word, sentiment: 'negative', impact: 'high' });
    });
    
    // Add custom lexicon words
    const tokens = text.toLowerCase().split(/\s+/);
    tokens.forEach(token => {
      if (this.customLexicon[token]) {
        const existing = keywords.find(k => k.word === token);
        if (!existing) {
          keywords.push({
            word: token,
            sentiment: this.customLexicon[token] > 0 ? 'positive' : 'negative',
            impact: Math.abs(this.customLexicon[token]) > 2 ? 'high' : 'medium'
          });
        }
      }
    });
    
    return keywords;
  }

  analyzeAspects(text) {
    const aspects = {
      location: { score: 0, mentions: 0 },
      price: { score: 0, mentions: 0 },
      size: { score: 0, mentions: 0 },
      condition: { score: 0, mentions: 0 },
      amenities: { score: 0, mentions: 0 },
      service: { score: 0, mentions: 0 },
      neighborhood: { score: 0, mentions: 0 }
    };
    
    const aspectKeywords = {
      location: ['location', 'area', 'place', 'situated', 'neighborhood'],
      price: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value'],
      size: ['size', 'space', 'spacious', 'small', 'large', 'room'],
      condition: ['condition', 'maintained', 'new', 'old', 'renovated', 'clean'],
      amenities: ['amenities', 'facilities', 'pool', 'gym', 'parking', 'garden'],
      service: ['service', 'management', 'landlord', 'response', 'helpful'],
      neighborhood: ['neighborhood', 'neighbors', 'community', 'quiet', 'safe']
    };
    
    const lowerText = text.toLowerCase();
    
    Object.entries(aspectKeywords).forEach(([aspect, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          aspects[aspect].mentions++;
          
          // Extract context around keyword
          const index = lowerText.indexOf(keyword);
          const contextStart = Math.max(0, index - 50);
          const contextEnd = Math.min(lowerText.length, index + keyword.length + 50);
          const context = lowerText.substring(contextStart, contextEnd);
          
          // Analyze sentiment of context
          const contextSentiment = this.sentiment.analyze(context);
          aspects[aspect].score += contextSentiment.score;
        }
      });
    });
    
    // Normalize scores
    Object.keys(aspects).forEach(aspect => {
      if (aspects[aspect].mentions > 0) {
        aspects[aspect].score = aspects[aspect].score / aspects[aspect].mentions;
        aspects[aspect].sentiment = 
          aspects[aspect].score > 0 ? 'positive' : 
          aspects[aspect].score < 0 ? 'negative' : 'neutral';
      } else {
        aspects[aspect].sentiment = 'not mentioned';
      }
    });
    
    return aspects;
  }

  calculateConfidence(sentimentResult, customScore) {
    // Calculate confidence based on strength of sentiment
    const totalWords = sentimentResult.tokens.length;
    const sentimentWords = sentimentResult.positive.length + sentimentResult.negative.length;
    
    const wordRatio = sentimentWords / totalWords;
    const scoreStrength = Math.abs(sentimentResult.score + customScore) / 10;
    
    const confidence = Math.min((wordRatio + scoreStrength) / 2, 1);
    
    return confidence;
  }

  extractThemes(analyzedReviews) {
    const themes = {};
    
    analyzedReviews.forEach(review => {
      review.keywords.forEach(keyword => {
        if (!themes[keyword.word]) {
          themes[keyword.word] = {
            word: keyword.word,
            count: 0,
            sentiment: keyword.sentiment,
            totalScore: 0
          };
        }
        themes[keyword.word].count++;
        themes[keyword.word].totalScore += review.score;
      });
    });
    
    // Convert to array and sort by frequency
    const themeArray = Object.values(themes)
      .map(theme => ({
        ...theme,
        averageScore: theme.totalScore / theme.count
      }))
      .sort((a, b) => b.count - a.count);
    
    return {
      positive: themeArray.filter(t => t.sentiment === 'positive').slice(0, 10),
      negative: themeArray.filter(t => t.sentiment === 'negative').slice(0, 10),
      all: themeArray.slice(0, 20)
    };
  }

  generateInsights(analyzedReviews, themes) {
    const insights = [];
    
    // Overall sentiment insight
    const positiveRatio = analyzedReviews.filter(r => r.sentiment === 'positive').length / analyzedReviews.length;
    
    if (positiveRatio > 0.8) {
      insights.push({
        type: 'success',
        message: 'Property receives overwhelmingly positive reviews',
        importance: 'high'
      });
    } else if (positiveRatio < 0.4) {
      insights.push({
        type: 'warning',
        message: 'Property has concerning number of negative reviews',
        importance: 'high'
      });
    }
    
    // Theme-based insights
    if (themes.negative.length > 0) {
      const topNegative = themes.negative.slice(0, 3).map(t => t.word).join(', ');
      insights.push({
        type: 'improvement',
        message: `Common complaints about: ${topNegative}`,
        importance: 'medium'
      });
    }
    
    if (themes.positive.length > 0) {
      const topPositive = themes.positive.slice(0, 3).map(t => t.word).join(', ');
      insights.push({
        type: 'strength',
        message: `Reviewers love: ${topPositive}`,
        importance: 'medium'
      });
    }
    
    // Aspect-based insights
    const aspectScores = {};
    analyzedReviews.forEach(review => {
      Object.entries(review.aspects).forEach(([aspect, data]) => {
        if (!aspectScores[aspect]) {
          aspectScores[aspect] = { total: 0, count: 0 };
        }
        if (data.mentions > 0) {
          aspectScores[aspect].total += data.score;
          aspectScores[aspect].count++;
        }
      });
    });
    
    Object.entries(aspectScores).forEach(([aspect, data]) => {
      if (data.count > 0) {
        const avgScore = data.total / data.count;
        if (avgScore < -1) {
          insights.push({
            type: 'critical',
            message: `Major issues with ${aspect}`,
            importance: 'high'
          });
        } else if (avgScore > 1) {
          insights.push({
            type: 'highlight',
            message: `Excellent ${aspect}`,
            importance: 'medium'
          });
        }
      }
    });
    
    return insights;
  }

  analyzeSentimentTimeline(reviews) {
    // Group reviews by month
    const timeline = {};
    
    reviews.forEach(review => {
      const date = new Date(review.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!timeline[monthKey]) {
        timeline[monthKey] = {
          month: monthKey,
          reviews: [],
          averageSentiment: 0
        };
      }
      
      timeline[monthKey].reviews.push(review);
    });
    
    // Calculate average sentiment per month
    Object.values(timeline).forEach(month => {
      const sentiments = month.reviews.map(r => {
        const analysis = this.sentiment.analyze(r.comment);
        return analysis.score;
      });
      
      month.averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
      month.trend = month.averageSentiment > 0 ? 'positive' : month.averageSentiment < 0 ? 'negative' : 'neutral';
    });
    
    return Object.values(timeline).sort((a, b) => a.month.localeCompare(b.month));
  }

  generateRecommendations(analyzedReviews, themes) {
    const recommendations = [];
    
    // Based on negative themes
    if (themes.negative.length > 0) {
      themes.negative.slice(0, 5).forEach(theme => {
        const recommendation = this.getRecommendationForIssue(theme.word);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      });
    }
    
    // Based on sentiment distribution
    const negativeRatio = analyzedReviews.filter(r => r.sentiment === 'negative').length / analyzedReviews.length;
    
    if (negativeRatio > 0.3) {
      recommendations.push({
        priority: 'high',
        action: 'Address customer concerns',
        description: 'High percentage of negative reviews requires immediate attention'
      });
    }
    
    // Based on aspects
    const aspectRecommendations = this.getAspectRecommendations(analyzedReviews);
    recommendations.push(...aspectRecommendations);
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations.slice(0, 10);
  }

  getRecommendationForIssue(issue) {
    const recommendations = {
      'dirty': {
        priority: 'high',
        action: 'Improve cleaning standards',
        description: 'Reviews mention cleanliness issues'
      },
      'noisy': {
        priority: 'medium',
        action: 'Address noise complaints',
        description: 'Consider soundproofing or quiet hours policy'
      },
      'expensive': {
        priority: 'low',
        action: 'Review pricing strategy',
        description: 'Price concerns mentioned in reviews'
      },
      'small': {
        priority: 'low',
        action: 'Highlight space efficiency',
        description: 'Emphasize clever use of space in marketing'
      },
      'old': {
        priority: 'medium',
        action: 'Consider renovations',
        description: 'Property age is a concern for reviewers'
      }
    };
    
    return recommendations[issue];
  }

  getAspectRecommendations(analyzedReviews) {
    const recommendations = [];
    const aspectThresholds = {
      location: -0.5,
      price: -0.3,
      condition: -0.5,
      amenities: -0.4,
      service: -0.6
    };
    
    const aspectScores = {};
    
    analyzedReviews.forEach(review => {
      Object.entries(review.aspects).forEach(([aspect, data]) => {
        if (data.mentions > 0) {
          if (!aspectScores[aspect]) {
            aspectScores[aspect] = [];
          }
          aspectScores[aspect].push(data.score);
        }
      });
    });
    
    Object.entries(aspectScores).forEach(([aspect, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      if (avgScore < (aspectThresholds[aspect] || -0.5)) {
        recommendations.push({
          priority: 'high',
          action: `Improve ${aspect}`,
          description: `Reviews indicate significant issues with ${aspect}`
        });
      }
    });
    
    return recommendations;
  }

  async analyzeConversation(messages) {
    try {
      const sentiments = [];
      let totalScore = 0;
      
      for (const message of messages) {
        const analysis = await this.analyzeText(message.content);
        sentiments.push({
          messageId: message._id,
          timestamp: message.timestamp,
          sentiment: analysis.sentiment,
          score: analysis.score
        });
        totalScore += analysis.score;
      }
      
      // Detect sentiment shifts
      const shifts = this.detectSentimentShifts(sentiments);
      
      // Overall conversation sentiment
      const avgScore = messages.length > 0 ? totalScore / messages.length : 0;
      const overallSentiment = avgScore > 0.2 ? 'positive' : avgScore < -0.2 ? 'negative' : 'neutral';
      
      // Conversation dynamics
      const dynamics = this.analyzeConversationDynamics(sentiments);
      
      return {
        overall: {
          sentiment: overallSentiment,
          score: avgScore
        },
        messages: sentiments,
        shifts,
        dynamics,
        trend: this.calculateSentimentTrend(sentiments)
      };
    } catch (error) {
      console.error('Conversation analysis error:', error);
      throw error;
    }
  }

  detectSentimentShifts(sentiments) {
    const shifts = [];
    
    for (let i = 1; i < sentiments.length; i++) {
      const prev = sentiments[i - 1];
      const curr = sentiments[i];
      
      if (prev.sentiment !== curr.sentiment) {
        const scoreDiff = Math.abs(curr.score - prev.score);
        
        if (scoreDiff > 0.5) {
          shifts.push({
            from: prev.sentiment,
            to: curr.sentiment,
            atMessage: i,
            significance: scoreDiff > 1 ? 'high' : 'medium'
          });
        }
      }
    }
    
    return shifts;
  }

  analyzeConversationDynamics(sentiments) {
    if (sentiments.length < 2) {
      return { type: 'brief', description: 'Too short to analyze dynamics' };
    }
    
    const firstHalf = sentiments.slice(0, Math.floor(sentiments.length / 2));
    const secondHalf = sentiments.slice(Math.floor(sentiments.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 0.3) {
      return { type: 'improving', description: 'Conversation sentiment improving over time' };
    } else if (secondHalfAvg < firstHalfAvg - 0.3) {
      return { type: 'deteriorating', description: 'Conversation sentiment deteriorating' };
    } else {
      return { type: 'stable', description: 'Consistent sentiment throughout conversation' };
    }
  }

  calculateSentimentTrend(sentiments) {
    if (sentiments.length < 3) return 'insufficient_data';
    
    // Simple linear regression
    const n = sentiments.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    sentiments.forEach((s, i) => {
      sumX += i;
      sumY += s.score;
      sumXY += i * s.score;
      sumX2 += i * i;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    if (slope > 0.01) return 'upward';
    if (slope < -0.01) return 'downward';
    return 'flat';
  }
}

export default new SentimentAnalysisService();