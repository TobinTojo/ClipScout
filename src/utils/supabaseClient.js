import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ygjdcwlyfqqwtzcsalfa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnamRjd2x5ZnFxd3R6Y3NhbGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTg3MTIsImV4cCI6MjA2ODE3NDcxMn0.Dvk61De5v2t4M0tSF8DmMsHF32zQd0etfD4XPeG9QJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 