import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// DIAGNOSTIC LOGGING
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚫 CRITICAL: Supabase credentials missing in browser context!');
    console.log('Detected Host:', typeof window !== 'undefined' ? window.location.hostname : 'Server');
    console.log('Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel settings.');
} else {
    console.log('✅ Supabase initialized for URL:', supabaseUrl.substring(0, 15) + '...');
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        console.group('🚀 PROD MODE: Configuration active');
        console.log('Host:', window.location.hostname);
        console.log('Env State: API_REACHABLE');
        console.groupEnd();
    }
}

// Attach to window for easier debugging via browser console
if (typeof window !== 'undefined') {
    window.SUPABASE_DEBUG = {
        url_exists: !!supabaseUrl,
        key_exists: !!supabaseAnonKey,
        app_origin: window.location.origin
    };
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
