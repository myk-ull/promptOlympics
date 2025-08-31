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
      <div className="mb-5">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image in detail to recreate it..."
          disabled={isLoading}
          className="textarea w-full"
          style={{
            borderColor: isOverLimit ? 'var(--error)' : undefined,
            minHeight: '180px',
            fontSize: '1.05rem'
          }}
        />
        
        <div className="flex justify-between items-center mt-3">
          <span 
            className="text-sm font-medium"
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
        style={{ padding: '1.125rem 2rem', fontSize: '1.05rem' }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderWidth: '2px' }}></span>
            Generating...
          </span>
        ) : (
          'Generate Image'
        )}
      </button>
      
      <div className="mt-5 p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <p className="text-sm text-center" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          💡 <strong>Tip:</strong> Be specific about colors, objects, style, and composition
        </p>
      </div>
    </form>
  );
}