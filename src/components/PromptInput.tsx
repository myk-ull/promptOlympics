'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  maxWords: number;
}

export function PromptInput({ onSubmit, isLoading, maxWords }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isOverLimit = wordCount > maxWords;
  const isValid = wordCount > 0 && !isOverLimit;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(prompt.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe the image you want to generate..."
          disabled={isLoading}
          className={`
            w-full p-4 rounded-lg min-h-[120px] resize-none
            bg-gray-800/50 border transition-all duration-300
            placeholder-gray-500 text-gray-100
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isFocused ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700'}
            ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        />
        
        {/* Word count indicator */}
        <div className={`absolute bottom-2 right-2 text-xs transition-colors duration-200 ${
          isOverLimit ? 'text-red-400' : wordCount > maxWords * 0.8 ? 'text-yellow-400' : 'text-gray-500'
        }`}>
          {wordCount}/{maxWords} words
        </div>
      </div>
      
      {isOverLimit && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <span>⚠️</span> Prompt exceeds {maxWords} word limit
        </p>
      )}
      
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn-gradient w-full relative overflow-hidden group"
      >
        <span className={`relative z-10 ${isLoading ? 'opacity-0' : ''}`}>
          Generate Image
        </span>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </button>
    </form>
  );
}