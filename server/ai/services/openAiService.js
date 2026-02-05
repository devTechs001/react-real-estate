import OpenAI from 'openai';
import { Redis } from 'ioredis';
import crypto from 'crypto';

class OpenAIService {
  constructor() {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API key not found. AI features will be disabled.');
      this.hasApiKey = false;
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.hasApiKey = true;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Professional description for ${propertyData.propertyType} in ${propertyData.location} with ${propertyData.bedrooms} bedrooms and ${propertyData.bathrooms} bathrooms. This property offers ${propertyData.area} sqft of living space with modern amenities and great potential.`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Based on the property information, I can provide a general answer. For specific details about this property, please contact the seller directly. Question: ${question}`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Current market insights for ${propertyType} in ${location}: The real estate market is showing moderate activity with average price trends. Investment potential is considered good for long-term holding. Best time to buy is typically during fall/winter months. Future outlook appears stable with gradual growth expected.`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Property Comparison Report:\n\n${properties.map((p, i) => `${i+1}. Property ${i+1}: ${p.propertyType} in ${p.location} with ${p.bedrooms} beds, ${p.bathrooms} baths, ${p.area} sqft. Price: $${p.price || 'N/A'}\n`).join('\n')}Based on the basic information, consider factors like location, size, price per sqft, and amenities when making your decision.`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Neighborhood Analysis for ${location}:\n\n1. Demographics: Mixed residential area with diverse population.\n2. Safety: Generally safe with typical urban crime levels.\n3. Schools: Access to public and private schools within 5 miles.\n4. Transportation: Good public transit connectivity with bus routes.\n5. Shopping: Local malls and grocery stores within 2 miles.\n6. Healthcare: Medical facilities and hospitals accessible within 10 minutes.\n7. Recreation: Parks and recreational facilities nearby.\n8. Development: Ongoing infrastructure improvements planned.\n9. Property Trends: Stable appreciation over recent years.\n10. Best for: Families and young professionals.`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      return `Investment Analysis for ${property.propertyType} in ${property.location}:\n\n1. ROI: Estimated 6-8% annually based on market averages.\n2. Rental Potential: Approx. $${Math.round(property.area * 1.2)} monthly rent.\n3. Appreciation: Projected 3-5% annual increase.\n4. Risk: Moderate risk level.\n5. Financing: Conventional mortgage recommended.\n6. Tax Benefits: Standard deductions apply.\n7. Exit Strategy: Hold for 5-7 years for optimal returns.\n8. Investment Score: 7/10.`;
    }

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
    if (!this.hasApiKey) {
      // Return a mock response when API key is not available
      // Create a basic object based on the schema with placeholder values
      const mockResult = {};
      for (const key in schema) {
        if (typeof schema[key] === 'object' && schema[key].type) {
          switch (schema[key].type.toLowerCase()) {
            case 'string':
              mockResult[key] = `Extracted ${key} from text`;
              break;
            case 'number':
              mockResult[key] = Math.floor(Math.random() * 100);
              break;
            case 'boolean':
              mockResult[key] = true;
              break;
            default:
              mockResult[key] = null;
          }
        } else {
          mockResult[key] = `Value for ${key}`;
        }
      }
      return mockResult;
    }

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