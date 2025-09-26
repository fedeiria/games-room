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
