import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Logins {
  
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createSupabaseClientConnection();
  }

  // guarda el registro de conexion del usuario
  async saveLoginTimestamp(user_id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('logins')
      .insert({ user_id: user_id, created_at: new Date() });

    if (error) {
      console.log('database error: ', error);
    }
  }
}
