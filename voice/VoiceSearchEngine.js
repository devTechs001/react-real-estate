// voice/VoiceSearchEngine.js
class VoiceSearchEngine {
  constructor() {
    this.speechRecognition = new (window.SpeechRecognition || 
                                 window.webkitSpeechRecognition)();
    this.nlpProcessor = new NLPProcessor();
    this.setupRecognition();
  }
  
  setupRecognition() {
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = 'en-US';
    
    this.speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      this.processVoiceCommand(transcript);
    };
  }
  
  async processVoiceCommand(transcript) {
    // Parse intent using NLP
    const intent = await this.nlpProcessor.parseIntent(transcript);
    
    switch(intent.type) {
      case 'search_properties':
        await this.handlePropertySearch(intent);
        break;
        
      case 'filter_results':
        await this.applyVoiceFilters(intent);
        break;
        
      case 'schedule_viewing':
        await this.scheduleViaVoice(intent);
        break;
        
      case 'ask_question':
        await this.answerPropertyQuestion(intent);
        break;
        
      default:
        console.log('Command not recognized');
    }
  }
  
  async handlePropertySearch(intent) {
    const searchParams = this.extractSearchParameters(intent);
    
    // Example: "Show me 3 bedroom houses under $500,000 in Brooklyn"
    const results = await api.searchProperties({
      bedrooms: searchParams.bedrooms || 3,
      maxPrice: searchParams.maxPrice || 500000,
      location: searchParams.location || 'Brooklyn',
      propertyType: searchParams.propertyType || 'house'
    });
    
    // Convert to voice response
    const voiceResponse = this.createVoiceResponse(results);
    this.speakResponse(voiceResponse);
    
    // Display results visually
    this.displayResults(results);
  }
  
  createVoiceResponse(results) {
    const count = results.length;
    
    if (count === 0) {
      return "I couldn't find any properties matching your criteria.";
    }
    
    const topResult = results[0];
    
    return `I found ${count} properties. The top match is a ${topResult.bedrooms} 
            bedroom ${topResult.propertyType} at ${topResult.address} for 
            ${this.formatCurrency(topResult.price)}. It has ${topResult.bathrooms} 
            bathrooms and ${topResult.squareFeet} square feet. Would you like to 
            hear more details or see it on the map?`;
  }
  
  speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    speechSynthesis.speak(utterance);
  }
}

export default VoiceSearchEngine;