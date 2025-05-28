
import { createClient } from '@supabase/supabase-js';

// Use the connected Supabase project
const supabaseUrl = "https://wxlwhqlbxyuyujhqeyur.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bHdocWxieHl1eXVqaHFleXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjAyNTMsImV4cCI6MjA1Mzc5NjI1M30.6TlBEqXOPZRgwhPrHQBYjMMVzmCTmCb-Q1-sNnFhVrc";

export const supabase = createClient(supabaseUrl, supabaseKey);
