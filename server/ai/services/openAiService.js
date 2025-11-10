import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  // Chat completion
  async chat(messages, context = {}) {
    try {
      const systemPrompt = `You are an expert real estate assistant. You help users find properties, 
      answer questions about real estate, provide market insights, and assist with property decisions. 
      Be professional, helpful, and accurate. ${context.additionalContext || ''}`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        message: completion.choices[0].message.content,
        usage: completion.usage,
      };
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw new Error('AI chat service unavailable');
    }
  }

  // Property description generation
  async generatePropertyDescription(propertyData) {
    try {
      const prompt = `Generate an engaging, professional property description for:
      - Type: ${propertyData.propertyType}
      - Location: ${propertyData.location}
      - Bedrooms: ${propertyData.bedrooms}
      - Bathrooms: ${propertyData.bathrooms}
      - Area: ${propertyData.area} sqft
      - Amenities: ${propertyData.amenities.join(', ')}
      - Price: $${propertyData.price}
      
      Make it attractive to potential buyers/renters. Focus on unique features and benefits.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Description Generation Error:', error);
      throw error;
    }
  }

  // Image analysis
  async analyzePropertyImage(imageUrl) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this property image and provide:
                1. Room type identification
                2. Condition assessment
                3. Notable features
                4. Estimated quality (1-10)
                5. Potential issues or concerns
                6. Suggestions for improvement`,
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      return this.parseImageAnalysis(completion.choices[0].message.content);
    } catch (error) {
      console.error('Image Analysis Error:', error);
      throw error;
    }
  }

  parseImageAnalysis(content) {
    // Parse the AI response into structured data
    return {
      analysis: content,
      timestamp: new Date(),
    };
  }

  // Market insights
  async generateMarketInsights(marketData) {
    try {
      const prompt = `Based on this real estate market data:
      - Average Price: $${marketData.avgPrice}
      - Total Listings: ${marketData.totalListings}
      - Price Trend: ${marketData.trend}%
      - Location: ${marketData.location}
      - Time Period: ${marketData.period}
      
      Provide:
      1. Market trend analysis
      2. Investment opportunities
      3. Price predictions for next 3 months
      4. Buyer/Seller market indicator
      5. Key recommendations`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 800,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Market Insights Error:', error);
      throw error;
    }
  }

  // Property matching
  async findSimilarProperties(userPreferences, availableProperties) {
    try {
      const prompt = `User is looking for:
      ${JSON.stringify(userPreferences, null, 2)}
      
      Available properties:
      ${JSON.stringify(availableProperties.slice(0, 20), null, 2)}
      
      Rank the top 5 most suitable properties and explain why each matches the user's needs.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Property Matching Error:', error);
      throw error;
    }
  }

  // Sentiment analysis for reviews
  async analyzeSentiment(text) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Analyze the sentiment of this review and provide a score from -1 (very negative) to 1 (very positive), and identify key themes:
            
            "${text}"
            
            Response format:
            Score: [number]
            Sentiment: [Positive/Neutral/Negative]
            Key Themes: [list]
            Concerns: [list if any]`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return this.parseSentimentResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      throw error;
    }
  }

  parseSentimentResponse(content) {
    const lines = content.split('\n');
    const result = {
      score: 0,
      sentiment: 'neutral',
      themes: [],
      concerns: [],
    };

    lines.forEach((line) => {
      if (line.includes('Score:')) {
        result.score = parseFloat(line.split(':')[1].trim());
      } else if (line.includes('Sentiment:')) {
        result.sentiment = line.split(':')[1].trim().toLowerCase();
      }
    });

    return result;
  }

  // Content moderation
  async moderateContent(content) {
    try {
      const moderation = await openai.moderations.create({
        input: content,
      });

      const result = moderation.results[0];

      return {
        flagged: result.flagged,
        categories: result.categories,
        categoryScores: result.category_scores,
        safe: !result.flagged,
      };
    } catch (error) {
      console.error('Content Moderation Error:', error);
      throw error;
    }
  }

  // Smart search query enhancement
  async enhanceSearchQuery(query) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Convert this natural language search into structured property search criteria:
            
            "${query}"
            
            Return JSON format:
            {
              "propertyType": "",
              "location": "",
              "minPrice": 0,
              "maxPrice": 0,
              "bedrooms": 0,
              "bathrooms": 0,
              "amenities": [],
              "keywords": []
            }`,
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      });

      const content = completion.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Query Enhancement Error:', error);
      return null;
    }
  }
}

export default new OpenAIService();