// ===== CONFIGURATION SUPABASE =====
import { createClient } from '@supabase/supabase-js';

// Création du client Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fonction pour vérifier la connexion Supabase
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('portraits')
      .select('count')
      .limit(1);
    
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}