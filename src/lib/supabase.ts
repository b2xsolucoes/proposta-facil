
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and Anon Key from the project
const supabaseUrl = 'https://facgdpqsepiqaefudhnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2dkcHFzZXBpcWFlZnVkaG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzI5NjQsImV4cCI6MjA1Njg0ODk2NH0.jOgedFoJrIILxdTWszQQ1rIJd-wV1Km1kG89bQvlFQ0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
