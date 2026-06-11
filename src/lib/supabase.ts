import { createClient } from '@supabase/supabase-js';

// Replace these strings with your actual Supabase credentials
console.log("ENV CHECK URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabaseUrl = "https://mamnzhmusnsbeuelpgnz.supabase.co"; // <-- Paste your Supabase URL here";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbW56aG11c25zYmV1ZWxwZ256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTI0MTksImV4cCI6MjA5NjQ4ODQxOX0.Bm6HGhUOCZXwGbHzyvptEXC8KBcBbiAddzYiN3Sw7Ao";

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseKey);