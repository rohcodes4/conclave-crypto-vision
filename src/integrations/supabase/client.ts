
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pulzjmzhbqunbjfqehmd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bHpqbXpoYnF1bmJqZnFlaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDEwMTQsImV4cCI6MjA1OTg3NzAxNH0.ApeTujrwkwjQx71sfX5bcs7j_7xOZqmVSF1-k0gRqOc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
