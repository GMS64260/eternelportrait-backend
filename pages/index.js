// ===== PAGE D'ACCUEIL API =====
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>EternelPortrait.ai - Backend API</title>
    <meta charset="utf-8">
    <style>
      body { 
        font-family: Arial, sans-serif; 
        max-width: 800px; 
        margin: 50px auto; 
        padding: 20px; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .container { 
        background: rgba(255,255,255,0.1); 
        padding: 30px; 
        border-radius: 15px;
        backdrop-filter: blur(10px);
      }
      h1 { color: #FFD700; text-align: center; }
      .endpoint { 
        background: rgba(255,255,255,0.2); 
        margin: 10px 0; 
        padding: 15px; 
        border-radius: 8px; 
      }
      .endpoint a { 
        color: #FFD700; 
        text-decoration: none; 
        font-weight: bold;
      }
      .status { 
        text-align: center; 
        font-size: 1.2em; 
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎨 EternelPortrait.ai - Backend API</h1>
      
      <div class="status">
        ✅ <strong>Backend opérationnel</strong>
      </div>
      
      <h2>🔗 Endpoints disponibles :</h2>
      
      <div class="endpoint">
        <strong>Health Check</strong><br>
        <a href="/api/health" target="_blank">/api/health</a><br>
        <small>Vérification du statut de l'API</small>
      </div>
      
      <div class="endpoint">
        <strong>Upload Photo</strong><br>
        <code>/api/upload-photo</code> (POST)<br>
        <small>Téléversement des photos vers Supabase</small>
      </div>
      
      <div class="endpoint">
        <strong>Generate Portrait</strong><br>
        <code>/api/generate</code> (POST)<br>
        <small>Génération IA via Hugging Face</small>
      </div>
      
      <hr style="margin: 30px 0; border: 1px solid rgba(255,255,255,0.3);">
      
      <p style="text-align: center; font-size: 0.9em; opacity: 0.8;">
        🚀 Déployé sur Vercel | 🗄️ Base de données Supabase | 🤖 IA Hugging Face
      </p>
    </div>
  </body>
  </html>
  `;
  
  res.status(200).send(html);
}