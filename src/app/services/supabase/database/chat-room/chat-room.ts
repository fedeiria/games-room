import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { Auth } from '../../auth/auth';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';
import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

// Fila tal como está en la DB
type ChatRoomRow = {
  id: string;
  user_id: string;
  user_email: string;
  content: string;
  created_at: Date;
};

@Injectable({
  providedIn: 'root'
})
export class ChatRoom implements OnDestroy {

  private limitRows: number = 100;
  private supabaseClient = createSupabaseClientConnection();
  private chatChannel: RealtimeChannel | null = null;

  private readonly messagesSubject = new BehaviorSubject<IChatMessage[]>([]);
  public readonly observableMessages$: Observable<IChatMessage[]> = this.messagesSubject.asObservable();
  
  constructor(private auth: Auth, private zone: NgZone) {
    this.auth.observableUserDetails$.subscribe(async userDetails => {
      if (userDetails?.data?.user) {
        await this.supabaseClient.auth.getSession();
        
        if (!this.chatChannel) {
          this.chatChannel = this.supabaseClient.channel('public:chat_room');
          this.fetchInitialMessages(this.limitRows);
        }
      }
      else {
        if (this.chatChannel) {
          this.supabaseClient.removeChannel(this.chatChannel);
          this.chatChannel = null;
        }
      }
    });
  }

  // obtengo una carga inicial de los mensajes
  private async fetchInitialMessages(limitRows: number) {
    const { data, error } = await this.supabaseClient
      .from('chat_room')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limitRows);

    if (error) {
      console.log('[ChatRoom] error al obtener los mensajes: ', error.message);
      return;
    }
    
    const messages = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      userEmail: row.user_email,
      content: row.content,
      createdAt: row.created_at,
    }));

    this.messagesSubject.next(messages);
    this.subscribeToRealtimeUpdates();
  }

  // suscripcion realtime al canal 'chat_room' 
  private subscribeToRealtimeUpdates(): void {
    if (!this.chatChannel) return;

    this.chatChannel
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_room' },
        (payload: RealtimePostgresChangesPayload<ChatRoomRow>) =>  {
          this.zone.run(() => {
            
            if (!payload.new) return;

            const newRow = payload.new as ChatRoomRow;

            const newMessage: IChatMessage = {
              id: newRow.id,
              userId: newRow.user_id,
              userEmail: newRow.user_email,
              content: newRow.content,
              createdAt: new Date(newRow.created_at),
            };

            const currentMessages = this.messagesSubject.getValue();
            this.messagesSubject.next([...currentMessages, newMessage]);
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime channel] status: ', status);
      });
  }

  // inserto el mensaje en la tabla 'chat_room'
  async sendMessage(content: string, userId: string, userEmail: string) {
    const trimmedContent = content?.trim();
    if (!trimmedContent || !userId) return;

    const user_id = userId
    const user_email = userEmail;

    const { error } = await this.supabaseClient
      .from('chat_room')
      .insert({
        user_id,
        user_email,
        content: trimmedContent
      });

    if (error) {
      console.error('[ChatRoom] error al enviar el mensaje: ', error);
    }
  }

  ngOnDestroy(): void {
    if (this.chatChannel) {
      this.supabaseClient.removeChannel(this.chatChannel);
    }
  }
}
