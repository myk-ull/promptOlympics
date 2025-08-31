'use client';

import { useEffect } from 'react';

export function EnvCheck() {
  useEffect(() => {
    console.log('🔍 Environment Variables Check:');
    console.log('================================');
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (url) {
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL is SET');
      console.log('   Value starts with:', url.substring(0, 30) + '...');
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_URL is NOT SET');
      console.log('   This needs to be added in Vercel Dashboard > Settings > Environment Variables');
    }
    
    if (key) {
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is SET');
      console.log('   Key length:', key.length, 'characters');
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is NOT SET');
      console.log('   This needs to be added in Vercel Dashboard > Settings > Environment Variables');
    }
    
    console.log('================================');
    
    if (!url || !key) {
      console.log('📝 Instructions:');
      console.log('1. Go to your Vercel Dashboard');
      console.log('2. Navigate to Settings > Environment Variables');
      console.log('3. Add the variables WITHOUT quotes');
      console.log('4. Select all environments (Production, Preview, Development)');
      console.log('5. Redeploy after adding variables');
    }
  }, []);

  return null;
}