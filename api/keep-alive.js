export default async function handler(req, res) {
  // Use environment variables provided by Vercel (or .env locally)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials in environment variables.' });
  }

  try {
    // Make a simple REST API call to Supabase to keep it awake.
    // We ping the profiles table, limiting to 1 result just to trigger an active connection.
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase returned status: ${response.status}`);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Supabase pinged successfully! Project will not be paused.' 
    });
  } catch (error) {
    console.error('Error pinging Supabase:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
