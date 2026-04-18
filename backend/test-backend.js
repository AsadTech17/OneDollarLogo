// Test script to verify backend functionality
import { generateLogo, logoServiceHealth } from './controllers/logoController.js';

console.log('Testing backend functionality...');

// Test the complete pipeline
const testCompletePipeline = async () => {
  try {
    console.log('Testing complete logo generation pipeline...');
    
    const testBusinessIdea = "A sustainable coffee shop with eco-friendly packaging";
    const mockRequest = {
      body: { businessIdea: testBusinessIdea }
    };

    // Test the full pipeline
    const result = await generateLogo(mockRequest, {
      json: () => Promise.resolve({ success: true, data: { businessIdea: testBusinessIdea } })
    });

    console.log('Pipeline test result:', result);
    return result;
  } catch (error) {
    console.error('Pipeline test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test individual services
const testServices = async () => {
  console.log('Testing individual services...');
  
  // Test health endpoint
  try {
    const healthResponse = await fetch('http://localhost:5000/api/logo-service/health');
    const healthData = await healthResponse.json();
    console.log('Health check result:', healthData);
  } catch (error) {
    console.error('Health check failed:', error);
  }

  return true;
};

// Run tests
const runTests = async () => {
  console.log('=== Backend Test Suite ===\n');
  
  await testServices();
  await testCompletePipeline();
  
  console.log('=== Tests Complete ===\n');
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testCompletePipeline, testServices, runTests };
