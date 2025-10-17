import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { IUser } from '../../../../interfaces/user/iuser';
import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class Users {
  
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createSupabaseClientConnection();
  }

  // inserta un nuevo usuario en 'users'
    public async saveNewUser(newUser: IUser): Promise<void> {
      const { error } = await this.supabaseClient.from('users').insert({ id: newUser.id, name: newUser.name, surname: newUser.surname, email: newUser.email, role_id: newUser.roleId, created_at: new Date() });
      
      if (error) {
        console.log('database error: ', error);
      }
    }

  // obtiene los datos de un usuario
  public async getUserData(userId: string | undefined): Promise<any[] | null> {
    const { data, error } = await this.supabaseClient.from('users').select().eq('id', userId);

    if (error) {
      console.error('error supabase: ', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map((dbUser: any) => {
      const roleAsNumber = Number(dbUser.role_id);

      const finalRoleId = (isNaN(roleAsNumber)) ? 1 : roleAsNumber;

      return {
        id: dbUser.id,
        name: dbUser.name,
        surname: dbUser.surname,
        email: dbUser.email,
        roleId: finalRoleId
      } as IUser;
    });
  }
}
