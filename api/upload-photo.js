// ===== API UPLOAD PHOTO =====
// Remplace la fonction simulateUpload() du frontend
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
    // Récupération des données de l'image (base64)
    const { imageData, filename, fileType } = req.body;
    
    if (!imageData || !filename) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image data and filename are required' 
      });
    }
    
    // Conversion base64 en buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Génération d'un nom unique pour le fichier
    const timestamp = new Date().getTime();
    const uniqueFilename = `portrait_${timestamp}_${filename}`;
    
    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('portraits') // Bucket que nous créerons
      .upload(uniqueFilename, buffer, {
        contentType: fileType || 'image/jpeg',
        cacheControl: '3600'
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to upload image to storage' 
      });
    }
    
    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('portraits')
      .getPublicUrl(uniqueFilename);
    
    // Sauvegarder l'info en base de données
    const { data: dbData, error: dbError } = await supabase
      .from('portraits')
      .insert([
        {
          filename: uniqueFilename,
          original_filename: filename,
          file_type: fileType,
          storage_path: data.path,
          public_url: publicUrlData.publicUrl,
          upload_date: new Date().toISOString(),
          status: 'uploaded'
        }
      ])
      .select();
    
    if (dbError) {
      console.error('Database insert error:', dbError);
      // L'upload a réussi mais pas la DB, on continue
    }
    
    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        filename: uniqueFilename,
        publicUrl: publicUrlData.publicUrl,
        storageKey: data.path,
        portraitId: dbData?.[0]?.id || null
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during upload' 
    });
  }
}