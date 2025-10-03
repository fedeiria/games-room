import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { environment } from "../../../environments/environment";

let supabase: SupabaseClient | null = null;

export function createSupabaseClientConnection(): SupabaseClient {
    if (!supabase) {
        supabase = createClient(
            environment.supabaseConfig.supabaseUrl,
            environment.supabaseConfig.supabaseKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: true
                },
            }
        );
    }
    return supabase;
}