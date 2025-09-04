// ===== CONFIGURATION SUPABASE =====
import { createClient } from '@supabase/supabase-js';

// Variables d'environnement Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier la connexion Supabase
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('portraits') // Table que nous créerons
      .select('count')
      .limit(1);
    
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}