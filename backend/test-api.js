import axios from 'axios';

// Test the complete API chain
const testLogoGeneration = async () => {
  try {
    console.log('Testing logo generation API chain...');
    
    const testData = {
      businessIdea: "A sustainable coffee shop that sources beans from local farmers and uses eco-friendly packaging. The brand should feel warm, welcoming, and environmentally conscious."
    };

    console.log('Sending request to:', 'http://localhost:5000/api/generate-logo');
    console.log('Test data:', testData);

    const response = await axios.post('http://localhost:5000/api/generate-logo', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log('SUCCESS: API chain working correctly');
      console.log(`Generated ${response.data.data.logos.length} logo variations`);
    } else {
      console.log('ERROR: API chain failed');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

// Test health endpoint
const testHealth = async () => {
  try {
    console.log('Testing health endpoint...');
    
    const response = await axios.get('http://localhost:5000/api/logo-service/health');
    
    console.log('Health check response:', response.data);
    
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('=== API Chain Test Suite ===\n');
  
  await testHealth();
  console.log('\n');
  await testLogoGeneration();
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testLogoGeneration, testHealth };
