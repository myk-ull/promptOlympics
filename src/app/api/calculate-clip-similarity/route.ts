import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { targetUrl, generatedUrl } = await request.json();
    
    if (!targetUrl || !generatedUrl) {
      return NextResponse.json(
        { error: 'Missing image URLs' },
        { status: 400 }
      );
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.error('REPLICATE_API_TOKEN not configured');
      return NextResponse.json(
        { similarity: 0.5 }, // Return default score if not configured
        { status: 200 }
      );
    }

    // Call Replicate API to calculate similarity
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "b4533e5f169ee82c053ad5f8fa665d6fb0e8c6d5e9e5b07b8efd1e19e8c5e887", // CLIP comparison model
        input: {
          image_a: targetUrl,
          image_b: generatedUrl
        }
      })
    });

    if (!response.ok) {
      console.error('Replicate API error:', response.statusText);
      return NextResponse.json(
        { similarity: 0.5 },
        { status: 200 }
      );
    }

    const prediction = await response.json();
    
    // Poll for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${apiToken}` }
      });
      result = await statusResponse.json();
      attempts++;
    }

    if (result.status === 'succeeded' && result.output !== undefined) {
      let similarity = 0.5;
      if (typeof result.output === 'number') {
        similarity = result.output;
      } else if (result.output && typeof result.output.similarity === 'number') {
        similarity = result.output.similarity;
      } else if (result.output && typeof result.output.score === 'number') {
        similarity = result.output.score;
      }
      return NextResponse.json({ similarity: Math.max(0, Math.min(1, similarity)) });
    }

    // Fallback
    return NextResponse.json({ similarity: 0.5 });
    
  } catch (error) {
    console.error('CLIP similarity calculation error:', error);
    return NextResponse.json(
      { similarity: 0.5 },
      { status: 200 }
    );
  }
}