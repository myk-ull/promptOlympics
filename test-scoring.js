// Test script for image similarity scoring
const fetch = require('node-fetch');

async function testScoring() {
  try {
    const response = await fetch('http://localhost:3000/api/calculate-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetImageUrl: 'https://picsum.photos/512/512?random=1',
        generatedImageUrl: 'https://picsum.photos/512/512?random=2'
      })
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      return;
    }

    const data = await response.json();
    console.log('Scoring result:', data);
  } catch (error) {
    console.error('Error testing scoring:', error);
  }
}

testScoring();