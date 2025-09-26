import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';
import { createSupabaseClientConnection } from '../../../../core/supabase/client-connection';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Fila tal como está en la DB
type ChatRoomRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

// Type guard para estrechar payload.new
function isChatRoomRow(row: unknown): row is ChatRoomRow {
  const r = row as any;
  return (
    !!r &&
    typeof r.id === 'string' &&
    typeof r.user_id === 'string' &&
    typeof r.content === 'string' &&
    typeof r.created_at === 'string'
  );
}

@Injectable({
  providedIn: 'root'
})
export class ChatRoom implements OnDestroy {

  private limitRows: number = 100;
  private supabaseClient = createSupabaseClientConnection();
  private chatChannel = this.supabaseClient.channel('realtime:chat_room');

  private messages$ = new BehaviorSubject<IChatMessage[]>([]);
  public observableMessages$ = this.messages$.asObservable();

  private emails$ = new BehaviorSubject<Map<string, string>>(new Map());
  public observableEmails$ = this.emails$.asObservable();

  private channelReady$ = new BehaviorSubject<boolean>(false);
  public observableChannelReady$ = this.channelReady$.asObservable();

  // Para evitar duplicar fetchs del mismo email
  private pendingEmailFetch = new Set<string>();
  
  constructor(private zone: NgZone) {
    this.fetchInitialMessages(this.limitRows);
  }

  // obtengo una carga inicial de los mensajes y me suscribo al canal
  private async fetchInitialMessages(limitRows: number) {
    const { data, error } = await this.supabaseClient
      .from('chat_room')
      .select('id, user_id, content, created_at, users(email)')
      .order('created_at', { ascending: true })
      .limit(limitRows);

    if (error) {
      console.log('[ChatRoom] error al obtener los mensajes: ', error.message);
    }
    else {
      const emails = new Map<string, string>();
      const messages = (data ?? []).map((row: any) => {
        
        const email = row.users?.email ?? (Array.isArray(row?.users) ? row.users[0]?.email : undefined);

        if (email) {
          emails.set(row.user_id, email);
        }

        return {
          id: row.id,
          userId: row.user_id,
          content: row.content,
          createdAt: new Date(row.created_at)
        };
      });

      this.messages$.next(messages);
      this.emails$.next(emails);
    }
    
    this.chatChannel
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_room' },
      (payload: RealtimePostgresChangesPayload<ChatRoomRow>) => {

        // estrecho el tipo de dato de forma segura
        if(!isChatRoomRow(payload.new)) {
          return;
        }

        const r = payload.new;
        this.zone.run(() => {
          const newMessage: IChatMessage = {
            id: r.id,
            userId: r.user_id,
            content: r.content,
            createdAt: new Date(r.created_at),
          };
          this.messages$.next([...this.messages$.getValue(), newMessage]);

          // Si no tengo el email cacheado lo resuevo aca
          this.ensureEmailCached(newMessage.userId);
        });
      }
    )
    .subscribe((status) => {
      console.log('[Realtime] Estado del canal: ', status);
    });
  }

  private async ensureEmailCached(userId: string) {
    const map = this.emails$.getValue();

    if (map.has(userId) || this.pendingEmailFetch.has(userId)) {
      return;
    }

    this.pendingEmailFetch.add(userId);

    try {
      const { data, error } = await this.supabaseClient
        .from('users')
        .select('email')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data?.email) {
        const next = new Map(map);
        next.set(userId, data.email);
        this.emails$.next(next);
      }
    }
    finally {
      this.pendingEmailFetch.delete(userId);
    }
  }

  async sendMessage(content: string) {
    const trimmed = content?.trim();

    if (!trimmed) return;

    const { data: userData, error: userErr } = await this.supabaseClient.auth.getUser();

    if (userErr || !userData?.user) {
      console.error('[ChatRoom] usuario no autenticado');
      return;
    }

    const user_id = userData.user.id;
    const { error } = await this.supabaseClient
      .from('chat_room')
      .insert({ user_id, content: trimmed });

    if (error) {
      console.error('[ChatRoom] error al enviar el mensaje: ', error);
    }
  }

  ngOnDestroy(): void {
    this.supabaseClient.removeChannel(this.chatChannel);
  }
}
