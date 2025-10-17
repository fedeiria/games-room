import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Surveys {
  
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createSupabaseClientConnection();
  }

  public async getAllSurveys(): Promise<any> {
    const { data, error } = await this.supabaseClient
    .from('surveys')
    .select('*, games(name)')
    .order('created_at', { ascending: false });

    if (error) {
      throw new Error('[surveys service]: Error al obtener los datos de las encuestas');
    }
    
    return data.reverse();
  }
}
