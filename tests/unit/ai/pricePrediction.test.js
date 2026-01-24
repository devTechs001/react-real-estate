// tests/unit/ai/pricePrediction.test.js
describe('Price Prediction AI Service', () => {
  beforeEach(() => {
    // Mock AI model responses
    jest.mock('@tensorflow/tfjs-node');
    jest.mock('../ai/services/pricePredictionService');
  });

  test('should predict price within 15% accuracy', async () => {
    const mockProperty = {
      location: { lat: 40.7128, lng: -74.0060 },
      squareFeet: 1500,
      bedrooms: 3,
      // ... other features
    };
    
    const prediction = await predictPrice(mockProperty);
    const actualPrice = 750000;
    const accuracy = Math.abs(prediction - actualPrice) / actualPrice;
    
    expect(accuracy).toBeLessThan(0.15); // 15% accuracy threshold
  });
  
  test('should handle edge cases gracefully', async () => {
    const extremeProperty = {
      squareFeet: 1000000, // Unrealistically large
      bedrooms: 50
    };
    
    await expect(predictPrice(extremeProperty))
      .rejects
      .toThrow('Input validation failed');
  });
});