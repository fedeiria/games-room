import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  
  private supabase: SupabaseClient;

  constructor() { 
    this.supabase = createClient(environment.supabaseConfig.supabaseUrl, environment.supabaseConfig.supabaseKey);
  }
}
