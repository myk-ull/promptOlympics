import { NextRequest, NextResponse } from 'next/server';
import { generateWithReplicate } from '@/lib/imageGeneration';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication back later
    // For now, allow anonymous image generation for testing

    const { prompt } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    // Word count validation
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount > 50) {
      return NextResponse.json(
        { error: 'Prompt exceeds 50 word limit' },
        { status: 400 }
      );
    }

    // Generate image using Replicate
    const imageUrl = await generateWithReplicate(prompt);
    
    return NextResponse.json({ imageUrl });
    
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}