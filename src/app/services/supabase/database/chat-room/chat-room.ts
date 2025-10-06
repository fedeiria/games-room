import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';

import { Auth } from '../../auth/auth';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';
import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';

@Injectable({
  providedIn: 'root'
})
export class ChatRoom implements OnDestroy {

  private limitRows: number = 50;

  private readonly supabaseClient: SupabaseClient = createSupabaseClientConnection();

  // lista de mensajes para el componente
  private readonly messagesSubject = new BehaviorSubject<IChatMessage[]>([]);
  public readonly observableMessages$: Observable<IChatMessage[]> = this.messagesSubject.asObservable();

  private authSubscription: Subscription | undefined;

  // canal realtime de supabase
  private chatChannel = this.supabaseClient.channel('chat_room_channel');
  
  constructor(private auth: Auth, private ngZone: NgZone) {
    this.loadInitialMessages();
    this.startRealtimeListener();
  }

  // carga inicial de mensajes
  private async loadInitialMessages(): Promise<void> {
    const { data, error } = await this.supabaseClient
      .from('chat_room')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(this.limitRows);

      if (error) {
        console.error('[chat-room service] - error al cargar los mensajes del chat: ', error);
        return;
      }

      if (data) {
        this.messagesSubject.next(data as IChatMessage[]);
      }
  }

  // inicia la subscripcion al canal
  private startRealtimeListener(): void {
    this.chatChannel
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_room' },
        (payload) => {
          this.ngZone.run(() => {
            const currentMessages = this.messagesSubject.value;
            const newMessage = payload.new as IChatMessage;

            this.messagesSubject.next([...currentMessages, newMessage]);
          });
        }
      )
      .subscribe();

      this.chatChannel.subscribe((status) =>{
        if (status === 'SUBSCRIBED') {
          console.log('canal activo y escuchando');
        }
        else {
          console.warn('estado del canal: ', status);
        }
      });
  }

  // guardo el mensaje en la tabla chat_room
  public async sendMessage(content: string) {
    const currentUser = await this.auth.currentUserDetails;

    if (!currentUser.data.user) {
      console.warn('[chat-room service]: usuario no logueado');
      return;
    }

    const user = currentUser.data.user;

    const { error } = await this.supabaseClient
      .from('chat_room')
      .insert({
        user_id: user.id,
        user_email: user.email,
        content: content
      });

    if (error) {
      console.error('[chat-room service] - Error al enviar el mensaje: ', error);
    }
  }

  // seek & destroy!
  ngOnDestroy(): void {
    this.supabaseClient.removeChannel(this.chatChannel);
    this.authSubscription?.unsubscribe();
  }
}
