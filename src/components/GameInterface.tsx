'use client';

import { useState, useEffect } from 'react';
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
}

export function GameInterface() {
  const [gameState, setGameState] = useState<GameState>({
    puzzle: null,
    userPrompt: '',
    generatedImage: null,
    scores: null,
    isGenerating: false,
    hasSubmitted: false
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDailyPuzzle();
    checkAuthentication();
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
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!gameState.puzzle) return;
    
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
      alert('Something went wrong. Please try again.');
    }
  };

  if (!gameState.puzzle) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="text-sm opacity-60 mt-4">Loading puzzle...</p>
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
      
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>
        {/* Header */}
        <header className="header">
          <div className="container" style={{ padding: '1rem', position: 'relative' }}>
            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ lineHeight: 1.2 }}>Promptle</h1>
              <p className="text-sm opacity-60" style={{ lineHeight: 1.2 }}>Daily AI Image Challenge</p>
            </div>
            
            {/* Sign in button positioned in top right */}
            <div style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)' }}>
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut().then(() => setUser(null))}
                  className="text-sm opacity-60"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm opacity-60"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem 0' }}>
          <div className="container">
            {!gameState.hasSubmitted ? (
              <div className="animate-fade-in">
                {/* Desktop: Side by side, Mobile: Stacked */}
                <div className="grid-responsive" style={{ gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                  {/* Target Image */}
                  <div>
                    <div className="mb-3">
                      <h2 className="text-sm font-medium opacity-60" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Target Image
                      </h2>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div className="image-frame">
                        <img 
                          src={gameState.puzzle.targetImageUrl} 
                          alt="Target image to recreate"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <div className="mb-3">
                      <h2 className="text-sm font-medium opacity-60" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Your Prompt
                      </h2>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                      <PromptInput 
                        onSubmit={handlePromptSubmit}
                        isLoading={gameState.isGenerating}
                        maxWords={50}
                      />
                      
                      {gameState.isGenerating && (
                        <div style={{ 
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'var(--bg-primary)',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          textAlign: 'center'
                        }}>
                          <div className="spinner" style={{ margin: '0 auto 0.5rem' }}></div>
                          <p className="text-sm opacity-60">Generating your image...</p>
                          <p className="text-sm opacity-60">This may take 10-30 seconds</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ScoreDisplay 
                targetImage={gameState.puzzle.targetImageUrl}
                generatedImage={gameState.generatedImage!}
                scores={gameState.scores!}
                promptUsed={gameState.userPrompt}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}