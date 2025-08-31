import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPuzzleForDate } from '@/lib/dailyPuzzles';

export async function GET(request: NextRequest) {
  try {
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Try to find today's puzzle in database
    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .select('*')
      .eq('date', todayStr)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    // If puzzle exists, return it
    if (puzzle) {
      return NextResponse.json({
        id: puzzle.id,
        date: puzzle.date,
        targetImageUrl: puzzle.target_image_url,
        targetImageDescription: puzzle.target_image_description,
        difficultyLevel: puzzle.difficulty_level
      });
    }

    // Get curated puzzle for today
    const dailyPuzzle = getPuzzleForDate(today);

    // Create puzzle in database
    const { data: newPuzzle, error: insertError } = await supabase
      .from('puzzles')
      .insert({
        date: todayStr,
        target_image_url: dailyPuzzle.url,
        target_image_description: dailyPuzzle.description,
        difficulty_level: dailyPuzzle.difficulty
      })
      .select()
      .single();

    if (insertError) {
      // If insert fails (maybe someone else created it), try to fetch again
      const { data: existingPuzzle } = await supabase
        .from('puzzles')
        .select('*')
        .eq('date', todayStr)
        .single();
      
      if (existingPuzzle) {
        return NextResponse.json({
          id: existingPuzzle.id,
          date: existingPuzzle.date,
          targetImageUrl: existingPuzzle.target_image_url,
          targetImageDescription: existingPuzzle.target_image_description,
          difficultyLevel: existingPuzzle.difficulty_level
        });
      }
      throw insertError;
    }

    return NextResponse.json({
      id: newPuzzle.id,
      date: newPuzzle.date,
      targetImageUrl: newPuzzle.target_image_url,
      targetImageDescription: newPuzzle.target_image_description,
      difficultyLevel: newPuzzle.difficulty_level
    });
    
  } catch (error) {
    console.error('Failed to get daily puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to load puzzle' },
      { status: 500 }
    );
  }
}