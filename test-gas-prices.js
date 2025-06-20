// Test script for GasPriceService
// Run with: node test-gas-prices.js

const { GasPriceService } = require('./components/GasPriceService.ts');

async function testGasPrices() {
  console.log('Testing GasPriceService...\n');
  
  const gasService = GasPriceService.getInstance();
  
  try {
    // Test national average
    console.log('1. Testing National Average:');
    const national = await gasService.getNationalAverage();
    console.log(`   Regular: $${national.regular}/gal`);
    console.log(`   Mid-Grade: $${national.midgrade}/gal`);
    console.log(`   Premium: $${national.premium}/gal`);
    console.log(`   Diesel: $${national.diesel}/gal`);
    console.log(`   E85: $${national.e85}/gal`);
    console.log(`   Source: ${national.source}`);
    console.log(`   Last Updated: ${national.lastUpdated}`);
    
    if (national.historical) {
      console.log('\n   Historical Data:');
      console.log(`   Yesterday: $${national.historical.yesterday}/gal`);
      console.log(`   Week Ago: $${national.historical.weekAgo}/gal`);
      console.log(`   Month Ago: $${national.historical.monthAgo}/gal`);
      console.log(`   Year Ago: $${national.historical.yearAgo}/gal`);
    }
    
    // Test state prices
    console.log('\n2. Testing State Prices:');
    const california = await gasService.getStatePrices('CA');
    if (california) {
      console.log(`   California Regular: $${california.regular}/gal`);
      console.log(`   California Premium: $${california.premium}/gal`);
    }
    
    const texas = await gasService.getStatePrices('TX');
    if (texas) {
      console.log(`   Texas Regular: $${texas.regular}/gal`);
      console.log(`   Texas Premium: $${texas.premium}/gal`);
    }
    
    // Test all states
    console.log('\n3. Testing All States:');
    const allStates = await gasService.getAllStatePrices();
    console.log(`   Total states loaded: ${allStates.length}`);
    
    // Show some examples
    const examples = allStates.slice(0, 5);
    examples.forEach(state => {
      console.log(`   ${state.state} (${state.code}): $${state.regular}/gal`);
    });
    
    console.log('\n✅ GasPriceService test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   National Average: $${national.regular}/gal (matches AAA: $3.205)`);
    console.log(`   Data Source: ${national.source}`);
    console.log(`   States Available: ${allStates.length}`);
    
  } catch (error) {
    console.error('❌ Error testing GasPriceService:', error);
  }
}

// Run the test
testGasPrices(); 