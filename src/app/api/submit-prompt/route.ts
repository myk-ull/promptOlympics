import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is available
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // TODO: Add authentication back later
    // For now, just store submissions without user tracking
    
    const { puzzleId, prompt, generatedImageUrl, scores, wordCount } = await request.json();
    
    if (!puzzleId || !prompt || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store submission in Supabase (without user for now)
    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        puzzle_id: puzzleId,
        prompt_text: prompt,
        word_count: wordCount,
        generated_image_url: generatedImageUrl,
        scores: scores,
        final_score: scores.final,
        // Temporary user ID until auth is connected
        user_id: '00000000-0000-0000-0000-000000000000'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to store submission:', error);
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission?.id || 'temp-' + Date.now(),
        finalScore: scores.final
      }
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit prompt' },
      { status: 500 }
    );
  }
}