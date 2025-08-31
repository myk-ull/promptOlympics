import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase environment variables not configured.');
    }
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

export const supabase = getSupabaseClient();

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Puzzle {
  id: number;
  date: string;
  target_image_url: string;
  target_image_description?: string;
  difficulty_level: number;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  puzzle_id: number;
  prompt_text: string;
  word_count: number;
  generated_image_url?: string;
  scores?: Record<string, unknown>;
  final_score?: number;
  attempts: number;
  created_at: string;
}

export interface DailyLeaderboard {
  id: string;
  puzzle_id: number;
  user_id: string;
  score: number;
  rank: number;
  created_at: string;
}