// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oyryuhpnqegdbuzcyxxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnl1aHBucWVnZGJ1emN5eHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODI5NDksImV4cCI6MjA1NzU1ODk0OX0.ZUkfnbCJmM_y4ZJDEaLLE1JX83bdw7ptOlTieTwJE2U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);