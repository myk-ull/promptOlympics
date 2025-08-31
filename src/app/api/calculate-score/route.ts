import { NextRequest, NextResponse } from 'next/server';
import { calculateEnsembleScore } from '@/lib/scoring/ensembleScorer';

export async function POST(request: NextRequest) {
  try {
    const { targetImageUrl, generatedImageUrl } = await request.json();
    
    if (!targetImageUrl || !generatedImageUrl) {
      return NextResponse.json(
        { error: 'Missing image URLs' },
        { status: 400 }
      );
    }

    const scores = await calculateEnsembleScore(targetImageUrl, generatedImageUrl);
    
    return NextResponse.json(scores);
    
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}