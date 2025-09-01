import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../../environments/environment';
import { IUser } from '../../../interfaces/user/iuser';

@Injectable({
  providedIn: 'root'
})
export class Database {
  
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseConfig.supabaseUrl, environment.supabaseConfig.supabaseKey, { auth: { autoRefreshToken: false, persistSession: true } });
  }

  // inserta un nuevo usuario en 'users'
  async saveNewUser(newUser: IUser) {
    const { error } = await this.supabase.from('users').insert({ id: newUser.id, name: newUser.name, surname: newUser.surname, email: newUser.email, role_id: newUser.roleId, created_at: new Date() });
    
    if (error) {
      console.log('database error: ', error);
    }
  }

  // guarda el registro de conexion del usuario
  async saveLoginTimestamp(email: string) {
    const { error } = await this.supabase.from('logins').insert({ email: email, created_at: new Date() });

    if (error) {
      console.log('database error: ', error);
    }
  }

  async getUserData(email: string) {
    const { error } = await this.supabase.from('users').select('*').gte('email', email);

    if (error) {
      console.log('database error: ', error);
    }
  }
}
