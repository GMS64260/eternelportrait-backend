// ===== API HEALTH CHECK =====
// Endpoint simple pour vérifier que l'API fonctionne
export default async function handler(req, res) {
  // Gestion CORS pour les navigateurs
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Répondre aux preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Information sur l'API
  const apiInfo = {
    status: 'OK',
    message: 'EternelPortrait.ai Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      upload: '/api/upload-photo',
      generate: '/api/generate'
    }
  };
  
  res.status(200).json(apiInfo);
}