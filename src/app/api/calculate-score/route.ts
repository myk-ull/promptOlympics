import { NextRequest, NextResponse } from 'next/server';
import { calculateEnsembleScore } from '@/lib/scoring/hybridScorer';

export async function POST(request: NextRequest) {
  try {
    console.log('=== API CALCULATE-SCORE DEBUG ===');
    console.log('Using scorer: hybridScorer.ts');
    console.log('Time:', new Date().toISOString());
    
    const { targetImageUrl, generatedImageUrl } = await request.json();
    
    if (!targetImageUrl || !generatedImageUrl) {
      return NextResponse.json(
        { error: 'Missing image URLs' },
        { status: 400 }
      );
    }

    const scores = await calculateEnsembleScore(targetImageUrl, generatedImageUrl);
    
    console.log('=== API RESPONSE ===');
    console.log('Final response:', JSON.stringify(scores, null, 2));
    
    return NextResponse.json(scores);
    
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}