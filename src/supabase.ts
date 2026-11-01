import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Client Supabase, ou null si les variables d'environnement ne sont pas définies :
 * l'app fonctionne alors en local uniquement, comme avant.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        // detectSessionInUrl : lit les liens reçus par e-mail (confirmation d'adresse, mot de passe oublié)
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

export const cloudEnabled = supabase !== null
