import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovhuzkrfxinrjepjhogr.supabase.co';
// PASTE THE VERY LONG KEY FROM SUPABASE SETTINGS HERE
const supabaseAnonKey = 'sb_publishable_jaieehU-S3mg_8CjXkPkLQ_ZwPS9Ndf'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);