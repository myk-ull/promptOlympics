'use client';

import { useState, useEffect } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { PromptInput } from './PromptInput';
import { ScoreDisplay } from './ScoreDisplay';
import { AuthModal } from './AuthModal';
import { supabase } from '@/lib/supabase';

interface Puzzle {
  id: number;
  date: string;
  targetImageUrl: string;
  targetImageDescription?: string;
  difficultyLevel: number;
}

interface ScoreBreakdown {
  similarity: number;
  final: number;
}

interface GameState {
  puzzle: Puzzle | null;
  userPrompt: string;
  generatedImage: string | null;
  scores: ScoreBreakdown | null;
  isGenerating: boolean;
  hasSubmitted: boolean;
  isAuthenticated: boolean;
}

export function GameInterface() {
  const [gameState, setGameState] = useState<GameState>({
    puzzle: null,
    userPrompt: '',
    generatedImage: null,
    scores: null,
    isGenerating: false,
    hasSubmitted: false,
    isAuthenticated: false
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDailyPuzzle();
    checkAuthentication();
    checkExistingSubmission();
  }, []);

  const loadDailyPuzzle = async () => {
    try {
      const response = await fetch('/api/get-daily-puzzle');
      const data = await response.json();
      
      if (response.ok) {
        setGameState(prev => ({ ...prev, puzzle: data }));
      }
    } catch (error) {
      console.error('Failed to load puzzle:', error);
    }
  };

  const checkAuthentication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setGameState(prev => ({ ...prev, isAuthenticated: true }));
    }
  };

  const checkExistingSubmission = async () => {
    try {
      const response = await fetch('/api/check-submission');
      const data = await response.json();
      
      if (data.hasSubmission) {
        setGameState(prev => ({
          ...prev,
          hasSubmitted: true,
          generatedImage: data.submission.generatedImageUrl,
          scores: data.submission.scores,
          userPrompt: data.submission.promptText
        }));
      }
    } catch (error) {
      console.error('Failed to check submission:', error);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!gameState.puzzle) return;
    
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      userPrompt: prompt,
      isGenerating: true
    }));

    try {
      // Generate image
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!generateResponse.ok) throw new Error('Image generation failed');
      
      const { imageUrl } = await generateResponse.json();

      // Calculate score
      const scoreResponse = await fetch('/api/calculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetImageUrl: gameState.puzzle.targetImageUrl,
          generatedImageUrl: imageUrl
        })
      });

      if (!scoreResponse.ok) throw new Error('Score calculation failed');
      
      const scores = await scoreResponse.json();

      // Submit result
      await fetch('/api/submit-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: gameState.puzzle.id,
          prompt,
          generatedImageUrl: imageUrl,
          scores,
          wordCount: prompt.split(' ').length
        })
      });

      setGameState(prev => ({
        ...prev,
        generatedImage: imageUrl,
        scores,
        hasSubmitted: true,
        isGenerating: false
      }));

    } catch (error) {
      console.error('Submission error:', error);
      setGameState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const getDifficultyBadge = (level: number) => {
    const badges = {
      1: { text: 'Easy', color: 'from-green-400 to-emerald-500' },
      2: { text: 'Medium', color: 'from-yellow-400 to-orange-500' },
      3: { text: 'Hard', color: 'from-red-400 to-pink-500' }
    };
    const badge = badges[level as keyof typeof badges] || badges[1];
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} text-white`}>
        {badge.text}
      </span>
    );
  };

  if (!gameState.puzzle) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 loading-pulse">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <AuthModal onSuccess={() => {
          setShowAuthModal(false);
          checkAuthentication();
        }} />
      )}
      
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Prompt Challenge
            </span>
          </h1>
          <p className="text-gray-400">Match the target image with your AI-generated creation</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-sm text-gray-500">
              {new Date(gameState.puzzle.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            {getDifficultyBadge(gameState.puzzle.difficultyLevel)}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Target Image */}
          <div className="glass-card p-6 slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Target Image</h2>
            <div className="image-container aspect-square">
              <img 
                src={gameState.puzzle.targetImageUrl} 
                alt="Target" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', gameState.puzzle?.targetImageUrl);
                  e.currentTarget.src = 'https://via.placeholder.com/512?text=Image+Loading+Error';
                }}
              />
            </div>
            {gameState.puzzle.targetImageDescription && (
              <p className="mt-4 text-sm text-gray-400 italic">
                Hint: {gameState.puzzle.targetImageDescription}
              </p>
            )}
          </div>

          {/* Right Side - Input or Results */}
          <div className="glass-card p-6 slide-up" style={{ animationDelay: '0.1s' }}>
            {!gameState.hasSubmitted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Your Challenge</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">📝 Write a prompt to recreate the target image</p>
                    <p className="text-sm text-gray-400 mb-2">🎯 Get scored on similarity (0-100)</p>
                    <p className="text-sm text-gray-400">⚡ Maximum 50 words allowed</p>
                  </div>
                  
                  <PromptInput 
                    onSubmit={handlePromptSubmit}
                    isLoading={gameState.isGenerating}
                    maxWords={50}
                  />
                  
                  {gameState.isGenerating && (
                    <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                        <p className="text-purple-300 text-sm">Generating your image...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="fade-in">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Your Result</h2>
                <ScoreDisplay 
                  targetImage={gameState.puzzle.targetImageUrl}
                  generatedImage={gameState.generatedImage!}
                  scores={gameState.scores!}
                  promptUsed={gameState.userPrompt}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stats/Leaderboard placeholder */}
        <div className="mt-8 glass-card p-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Today&apos;s Leaderboard</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Complete the challenge to see how you rank!</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}