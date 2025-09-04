// ===== ENDPOINT DEBUG =====
// Vérification des variables d'environnement
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Vérification des variables d'environnement (sans exposer les valeurs)
  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    HUGGING_FACE_API_TOKEN: !!process.env.HUGGING_FACE_API_TOKEN,
    NODE_ENV: process.env.NODE_ENV || 'undefined'
  };
  
  const allConfigured = Object.values(envCheck).every(v => v === true || v === 'production' || v === 'development');
  
  res.status(200).json({
    status: allConfigured ? 'OK' : 'MISSING_CONFIG',
    message: allConfigured ? 'All environment variables configured' : 'Some environment variables are missing',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
}