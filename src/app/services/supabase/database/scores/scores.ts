import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

interface IScoreInsert {
  gameId: number;
  score?: number;
  victory?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Scores {

  private readonly supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createSupabaseClientConnection();
  }

  async getScoresPerUser(userId: string): Promise<any> {
    const { data, error } = await this.supabaseClient
    .from('scores')
    .select('*, games(name)')
    .eq('user_id', userId);

    if (error) {
      console.error('[scores service] error al obtener los datos: ', error);
      throw new Error('Error al obtener las estadisticas del usuario');
    }

    return data;
  }

  async setScore({ gameId, score, victory }: IScoreInsert): Promise<void> {
    const { data: userData, error: userError } = await this.supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
      throw new Error('Usuario autenticado');
    }

    const user_id = userData.user.id;

    const { error } = await this.supabaseClient
      .from('scores')
      .insert({
        user_id,
        game_id: gameId,
        score: score,
        victory: victory
      });
  
    if (error) {
      console.error('[Scores] error al guardar en tabla score', error, { user_id, gameId, score });
      throw error;
    }
  }
}
