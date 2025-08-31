'use client';

interface ScoreDisplayProps {
  targetImage: string;
  generatedImage: string;
  scores: {
    similarity: number;
    final: number;
    components?: {
      semantic: number;
      perceptual: number;
      structural: number;
    };
  };
  promptUsed?: string;
}

export function ScoreDisplay({ targetImage, generatedImage, scores, promptUsed }: ScoreDisplayProps) {
  const similarityPercentage = Math.round(scores.similarity * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#6b7280';
  };
  
  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding!';
    if (score >= 80) return 'Excellent!';
    if (score >= 70) return 'Great job!';
    if (score >= 60) return 'Good effort!';
    if (score >= 50) return 'Not bad!';
    return 'Keep trying!';
  };

  const handleShare = () => {
    const text = `I scored ${scores.final}/100 on today's Promptle!\n\nPlay at: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    alert('Score copied to clipboard!');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Score Header */}
      <div className="text-center mb-8">
        <div className="mb-3">
          <span 
            className="font-extrabold"
            style={{ fontSize: '5rem', lineHeight: 1, color: getScoreColor(scores.final) }}
          >
            {scores.final}
          </span>
          <span className="text-3xl" style={{ color: 'var(--text-secondary)' }}>/100</span>
        </div>
        <p className="text-2xl font-semibold">{getScoreMessage(scores.final)}</p>
      </div>

      {/* Images Comparison */}
      <div className="grid-responsive mb-8" style={{ gap: '2rem' }}>
        <div className="card">
          <h3 className="text-base font-semibold mb-4" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Target
          </h3>
          <div className="image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={targetImage} alt="Target" />
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-base font-semibold mb-4" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Your Result
          </h3>
          <div className="image-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={generatedImage} alt="Generated" />
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="card mb-8">
        <h3 className="text-base font-semibold mb-6" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Score Breakdown
        </h3>
        
        {/* Component Scores */}
        {scores.components && (
          <>
            {/* Semantic Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-80">Content Match (What)</span>
                <span className="font-medium">{Math.round(scores.components.semantic * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.round(scores.components.semantic * 100)}%`,
                    background: '#3b82f6'
                  }}
                />
              </div>
            </div>
            
            {/* Perceptual Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-80">Style Match (How)</span>
                <span className="font-medium">{Math.round(scores.components.perceptual * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.round(scores.components.perceptual * 100)}%`,
                    background: '#8b5cf6'
                  }}
                />
              </div>
            </div>
            
            {/* Structural Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-80">Composition Match</span>
                <span className="font-medium">{Math.round(scores.components.structural * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.round(scores.components.structural * 100)}%`,
                    background: '#f59e0b'
                  }}
                />
              </div>
            </div>
            
            <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)' }}>
              {/* Overall Similarity Score */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-80 font-medium">Overall Similarity</span>
                  <span className="font-bold">{similarityPercentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${similarityPercentage}%`,
                      background: getScoreColor(scores.final)
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        {!scores.components && (
          /* Fallback for old scoring system */
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-80">Overall Similarity</span>
              <span className="font-medium">{similarityPercentage}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${similarityPercentage}%`,
                  background: getScoreColor(scores.final)
                }}
              />
            </div>
          </div>
        )}
        
        {/* Prompt */}
        {promptUsed && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <p className="text-sm opacity-60 mb-2">Your prompt:</p>
            <p className="text-sm" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              &ldquo;{promptUsed}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handleShare}
          className="btn btn-primary flex-1"
        >
          Share Score
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-secondary flex-1"
        >
          Play Again Tomorrow
        </button>
      </div>
    </div>
  );
}