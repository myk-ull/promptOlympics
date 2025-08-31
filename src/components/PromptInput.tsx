'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  maxWords: number;
}

export function PromptInput({ onSubmit, isLoading, maxWords }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  
  const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isOverLimit = wordCount > maxWords;
  const isEmpty = prompt.trim().length === 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmpty && !isOverLimit && !isLoading) {
      onSubmit(prompt.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image in detail..."
          disabled={isLoading}
          className="textarea w-full"
          style={{
            borderColor: isOverLimit ? 'var(--error)' : undefined,
            minHeight: '150px'
          }}
        />
        
        <div className="flex justify-between items-center mt-2">
          <span 
            className="text-sm"
            style={{ 
              color: isOverLimit ? 'var(--error)' : 'var(--text-secondary)' 
            }}
          >
            {wordCount}/{maxWords} words
          </span>
          {isOverLimit && (
            <span className="text-sm" style={{ color: 'var(--error)' }}>
              Too many words!
            </span>
          )}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isEmpty || isOverLimit || isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
      
      <p className="text-sm opacity-60 mt-3 text-center">
        Tip: Be specific about colors, objects, style, and composition
      </p>
    </form>
  );
}