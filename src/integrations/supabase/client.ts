
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nqibrtuxmslqdjnrpjvd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaWJydHV4bXNscWRqbnJwanZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzcxMjcsImV4cCI6MjA4MzU1MzEyN30.ermejJ4DsnnbZUKJQQyAmhIbAgqKN2hBVCVJeO34jcg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
