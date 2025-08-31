'use client';

interface ScoreDisplayProps {
  targetImage: string;
  generatedImage: string;
  scores: {
    similarity: number;
    final: number;
  };
  promptUsed?: string;
}

export function ScoreDisplay({ targetImage, generatedImage, scores, promptUsed }: ScoreDisplayProps) {
  const similarityPercentage = scores.similarity * 100;
  
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🌟';
    if (score >= 70) return '✨';
    if (score >= 60) return '👍';
    if (score >= 50) return '🎯';
    return '💪';
  };
  
  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! Near perfect match!';
    if (score >= 80) return 'Excellent work! Very close!';
    if (score >= 70) return 'Great job! Good similarity!';
    if (score >= 60) return 'Nice effort! Getting there!';
    if (score >= 50) return 'Good attempt! Room to improve.';
    return 'Keep practicing! You\'ll get better!';
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30">
        <div className="mb-2">
          <span className="text-6xl">{getScoreEmoji(scores.final)}</span>
        </div>
        <div className="score-display">{scores.final}</div>
        <div className="text-gray-400 mt-2">out of 100</div>
        <p className="text-purple-300 mt-4 text-sm">{getScoreMessage(scores.final)}</p>
      </div>

      {/* Generated Image */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">Your Generated Image</h3>
        <div className="image-container aspect-square">
          <img 
            src={generatedImage} 
            alt="Generated" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/512?text=Image+Failed';
            }}
          />
        </div>
      </div>

      {/* Prompt Used */}
      {promptUsed && (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Your Prompt:</h4>
          <p className="text-gray-300 italic text-sm">&ldquo;{promptUsed}&rdquo;</p>
        </div>
      )}

      {/* CLIP Similarity Score */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Similarity Analysis</h4>
        <div className="p-4 bg-gray-800/30 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm">CLIP Similarity</span>
            <span className="text-purple-400 font-semibold">
              {similarityPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${similarityPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            This score measures how semantically similar your generated image is to the target using advanced AI vision models.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={() => window.location.reload()}
          className="flex-1 py-3 px-4 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Try Again Tomorrow
        </button>
        <button className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105 active:scale-95">
          Share Score
        </button>
      </div>
    </div>
  );
}