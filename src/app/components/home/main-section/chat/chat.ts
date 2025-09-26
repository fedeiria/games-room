import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Observable, tap } from 'rxjs';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';
import { Auth } from '../../../../services/supabase/auth/auth';
import { ChatRoom } from '../../../../services/supabase/database/chat-room/chat-room';
import { UserResponse } from '@supabase/supabase-js';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements AfterViewInit, OnInit {

  protected messages$!: Observable<IChatMessage[]>;
  protected emailMap$!: Observable<Map<string, string>>;
  protected ready$!: Observable<boolean>;

  protected userDetails!: UserResponse;
  protected isChatVisible: boolean = false;
  protected newMessage: string = '';
  protected userId: string | undefined = '';
  protected userEmail: string | undefined = '';

  @ViewChild('messageContainer') private messageContainer!: ElementRef<HTMLDivElement>;
  
  constructor(private auth: Auth, private chatRoom: ChatRoom) { }

  async ngOnInit() {
    await this.getUserCredentials();

    this.messages$ = this.chatRoom.observableMessages$.pipe(
      tap(() => queueMicrotask(() => this.scrollToBottom()))
    );

    this.emailMap$ = this.chatRoom.observableEmails$;
    this.ready$ = this.chatRoom.observableChannelReady$;
  }

  // obtengo las credenciales del usuario logueado
  async getUserCredentials(): Promise<void> {
    try {
      this.userDetails = await this.auth.currentUserDetails;
      this.userEmail = this.userDetails?.data?.user?.email ?? undefined;
      this.userId = this.userDetails.data.user?.id ?? undefined;
    }
    catch(error) {
      // quitar el console.log y agregar un toast para mostrar al usuario
      console.error('Ocurrio un error al obtener los datos del usuario: ', error);
    }
  }

  // posteo el mensaje y lo guardo en chat_room
  async sendMessage(): Promise<void> {
    await this.chatRoom.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  // scroll inicial al inicializar el componente
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  // lleva el scroll de la ventana del chat hacia abajo
  private scrollToBottom(): void {
    const container = this.messageContainer?.nativeElement;

    if (!container) {
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
  }

  // muestra / oculta la ventana de chat
  toggleChatVisibility(): void {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      this.scrollToBottom();
    }
  }

  // submit del form
  onSubmit(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }
}
