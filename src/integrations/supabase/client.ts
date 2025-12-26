// DEPRECATED: This file is no longer used
// All Supabase functionality has been replaced with static data
// This file is kept for reference - can be removed later when Django API is integrated

// When converting to Django:
// 1. Replace static data imports with API calls
// 2. Use fetch/axios to call Django REST API endpoints
// 3. Update all data fetching functions to use Django API

/*
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ededavyhrbhabqswgxbn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "...";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'play-learn-grow-kids',
    },
  },
});
*/

// Mock export for backward compatibility (if any files still import this)
export const supabase = null as any;
