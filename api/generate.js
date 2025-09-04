// ===== API GÉNÉRATION IA =====
// Remplace startLoadingAnimation() par une vraie génération
export default async function handler(req, res) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }
  
  try {
    const { 
      imageUrl, 
      portraitData, 
      gazeIntensity = 50,
      colorFilter = 'natural',
      animatedFrame = true 
    } = req.body;
    
    if (!imageUrl || !portraitData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL and portrait data are required' 
      });
    }
    
    // Configuration du prompt basé sur les paramètres utilisateur
    const prompt = buildPrompt(portraitData, gazeIntensity, colorFilter);
    
    // Appel à Hugging Face API
    const hfResponse = await callHuggingFaceAPI(prompt, imageUrl);
    
    if (!hfResponse.success) {
      return res.status(500).json({
        success: false,
        error: 'IA generation failed',
        details: hfResponse.error
      });
    }
    
    // Simuler des étapes de progression pour le frontend
    const progressStages = [
      { stage: 'Analyse de l\'image...', progress: 20 },
      { stage: 'Application des filtres...', progress: 40 },
      { stage: 'Génération de l\'IA...', progress: 70 },
      { stage: 'Optimisation audio...', progress: 85 },
      { stage: 'Création du cadre magique...', progress: 95 },
      { stage: 'Finalisation...', progress: 100 }
    ];
    
    res.status(200).json({
      success: true,
      message: 'Portrait generated successfully',
      data: {
        generatedImageUrl: hfResponse.imageUrl,
        portraitId: hfResponse.portraitId,
        progressStages,
        settings: {
          gazeIntensity,
          colorFilter,
          animatedFrame
        }
      }
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during generation' 
    });
  }
}

// Construction du prompt basé sur les paramètres
function buildPrompt(portraitData, gazeIntensity, colorFilter) {
  const { firstName, relationship, birthDate, memorialDate } = portraitData;
  
  let basePrompt = `Create a magical eternal portrait of ${firstName || 'a beloved person'}`;
  
  if (relationship) {
    basePrompt += ` who was a dear ${relationship}`;
  }
  
  // Ajustement de l'intensité du regard
  const gazeDescriptions = [
    'peaceful and serene gaze', // 0-20
    'gentle and warm gaze',     // 21-40
    'intense and loving gaze',  // 41-60
    'deeply emotional gaze',    // 61-80
    'profoundly moving gaze'    // 81-100
  ];
  
  const gazeIndex = Math.floor(gazeIntensity / 20);
  const gazeDesc = gazeDescriptions[Math.min(gazeIndex, 4)];
  
  basePrompt += `. The portrait should have a ${gazeDesc}, `;
  
  // Filtre couleur
  const colorDescriptions = {
    'natural': 'natural colors with warm lighting',
    'warm': 'warm golden tones and soft amber lighting',
    'sepia': 'vintage sepia tones with nostalgic atmosphere',
    'blackwhite': 'elegant black and white with dramatic contrast'
  };
  
  basePrompt += colorDescriptions[colorFilter] || colorDescriptions['natural'];
  basePrompt += '. Style: ethereal, magical, memorial portrait with soft glowing effects and golden particles.';
  
  return basePrompt;
}

// Appel à l'API Hugging Face
async function callHuggingFaceAPI(prompt, imageUrl) {
  try {
    const HF_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
    
    if (!HF_TOKEN) {
      return { success: false, error: 'Hugging Face token not configured' };
    }
    
    // Utilisation de FLUX.1-schnell pour génération rapide
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 4, // Rapide pour le gratuit
            guidance_scale: 3.5,
            width: 512,
            height: 512
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `HF API Error: ${response.status} - ${errorText}` 
      };
    }
    
    const imageBlob = await response.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    // Dans un vrai cas, on sauvegarderait l'image générée sur Supabase
    const generatedImageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    return { 
      success: true, 
      imageUrl: generatedImageUrl,
      portraitId: Date.now() // ID temporaire
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}