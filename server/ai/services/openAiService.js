import OpenAI from 'openai';
import { Redis } from 'ioredis';
import crypto from 'crypto';

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    });
    this.cacheExpiry = 3600; // 1 hour
  }

  // Generate cache key
  generateCacheKey(prefix, data) {
    const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    return `ai:${prefix}:${hash}`;
  }

  // Get cached response
  async getCached(key) {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  // Set cached response
  async setCached(key, data, expiry = this.cacheExpiry) {
    try {
      await this.redis.setex(key, expiry, JSON.stringify(data));
    } catch (error) {
      console.error('Cache setting error:', error);
    }
  }

  // Generate property description
  async generatePropertyDescription(propertyData) {
    const cacheKey = this.generateCacheKey('description', propertyData);
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `Write an engaging and professional property description for:
        Type: ${propertyData.propertyType}
        Location: ${propertyData.location}
        Bedrooms: ${propertyData.bedrooms}
        Bathrooms: ${propertyData.bathrooms}
        Area: ${propertyData.area} sqft
        Features: ${propertyData.amenities?.join(', ') || 'N/A'}
        
        Make it appealing to potential buyers/renters, highlighting key features and benefits.
        Keep it under 200 words.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a professional real estate copywriter.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const description = response.choices[0].message.content;
      await this.setCached(cacheKey, description);
      return description;
    } catch (error) {
      console.error('OpenAI description generation error:', error);
      throw new Error('Failed to generate property description');
    }
  }

  // Answer property questions
  async answerPropertyQuestion(property, question) {
    try {
      const prompt = `Based on this property information:
        ${JSON.stringify(property, null, 2)}
        
        Answer the following question concisely and accurately:
        ${question}
        
        If the information is not available, politely say so and suggest contacting the seller.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful real estate assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 150,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Q&A error:', error);
      throw new Error('Failed to answer question');
    }
  }

  // Generate market insights
  async generateMarketInsights(location, propertyType) {
    const cacheKey = this.generateCacheKey('insights', { location, propertyType });
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `Provide detailed real estate market insights for:
        Location: ${location}
        Property Type: ${propertyType}
        
        Include:
        1. Current market trends
        2. Price trends
        3. Investment potential
        4. Best time to buy/sell
        5. Future outlook
        
        Format the response in a structured way with clear sections.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a real estate market analyst expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 500,
      });

      const insights = response.choices[0].message.content;
      await this.setCached(cacheKey, insights, 7200); // Cache for 2 hours
      return insights;
    } catch (error) {
      console.error('OpenAI insights generation error:', error);
      throw new Error('Failed to generate market insights');
    }
  }

  // Generate property comparison
  async compareProperties(properties) {
    try {
      const prompt = `Compare these properties and provide a detailed analysis:
        ${JSON.stringify(properties, null, 2)}
        
        Include:
        1. Price comparison and value assessment
        2. Feature comparison
        3. Location advantages/disadvantages
        4. Investment potential
        5. Recommendation based on different buyer profiles
        
        Format as a structured comparison report.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a real estate comparison expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 800,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI comparison error:', error);
      throw new Error('Failed to compare properties');
    }
  }

  // Generate neighborhood analysis
  async analyzeNeighborhood(location) {
    const cacheKey = this.generateCacheKey('neighborhood', { location });
    const cached = await this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const prompt = `Provide a comprehensive neighborhood analysis for: ${location}
        
        Include:
        1. Demographics
        2. Safety and crime statistics
        3. Schools and education
        4. Transportation and commute
        5. Shopping and entertainment
        6. Healthcare facilities
        7. Parks and recreation
        8. Future development plans
        9. Property value trends
        10. Best suited for (families, professionals, retirees, etc.)
        
        Be informative and balanced.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a neighborhood analysis expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 600,
      });

      const analysis = response.choices[0].message.content;
      await this.setCached(cacheKey, analysis, 86400); // Cache for 24 hours
      return analysis;
    } catch (error) {
      console.error('OpenAI neighborhood analysis error:', error);
      throw new Error('Failed to analyze neighborhood');
    }
  }

  // Generate investment analysis
  async analyzeInvestmentPotential(property, marketData) {
    try {
      const prompt = `Analyze the investment potential for this property:
        Property: ${JSON.stringify(property, null, 2)}
        Market Data: ${JSON.stringify(marketData, null, 2)}
        
        Provide:
        1. ROI calculation and projections
        2. Rental income potential
        3. Capital appreciation forecast
        4. Risk assessment
        5. Financing recommendations
        6. Tax implications
        7. Exit strategy options
        8. Overall investment score (1-10)
        
        Be specific with numbers and percentages where possible.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a real estate investment analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 700,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI investment analysis error:', error);
      throw new Error('Failed to analyze investment potential');
    }
  }

  // Extract structured data from text
  async extractStructuredData(text, schema) {
    try {
      const prompt = `Extract structured data from the following text according to the schema:
        
        Text: ${text}
        
        Schema: ${JSON.stringify(schema, null, 2)}
        
        Return a valid JSON object matching the schema. If a field cannot be determined, use null.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a data extraction specialist. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI data extraction error:', error);
      throw new Error('Failed to extract structured data');
    }
  }
}

export default new OpenAIService();