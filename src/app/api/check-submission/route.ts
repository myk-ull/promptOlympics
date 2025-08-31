import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ submission: null });
    }

    const user = await validateSession(token);
    if (!user) {
      return NextResponse.json({ submission: null });
    }

    // Get today's puzzle
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const puzzle = await prisma.puzzle.findFirst({
      where: {
        date: today
      }
    });

    if (!puzzle) {
      return NextResponse.json({ submission: null });
    }

    // Check if user has a submission for today's puzzle
    const submission = await prisma.submission.findUnique({
      where: {
        userId_puzzleId: {
          userId: user.id,
          puzzleId: puzzle.id
        }
      }
    });

    if (!submission) {
      return NextResponse.json({ submission: null });
    }

    return NextResponse.json({
      submission: {
        promptText: submission.promptText,
        generatedImageUrl: submission.generatedImageUrl,
        scores: submission.scores,
        finalScore: submission.finalScore
      }
    });
    
  } catch (error) {
    console.error('Failed to check submission:', error);
    return NextResponse.json({ submission: null });
  }
}