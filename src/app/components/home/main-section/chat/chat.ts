import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { filter, Observable, Subscription, switchMap, tap } from 'rxjs';

import { Auth } from '../../../../services/supabase/auth/auth';
import { ChatRoom } from '../../../../services/supabase/database/chat-room/chat-room';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';
import { Users } from '../../../../services/users/users';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements AfterViewInit, OnDestroy, OnInit {

  private authSubscription!: Subscription;

  public newMessage: string = '';
  public messages$!: Observable<IChatMessage[]>;
  
  public userId: string | null = null;
  public userEmail: string | null = null;
  public isChatVisible: boolean = false;
  
  @ViewChild('messageContainer') private messageContainer!: ElementRef<HTMLDivElement>;
  
  constructor(private auth: Auth, private chatRoom: ChatRoom, private users: Users) { }

  async ngOnInit() {
    this.authSubscription = this.auth.observableUserDetails$.subscribe(userDetails => {
      this.userId = userDetails?.data?.user?.id ?? null;
      this.userEmail = userDetails?.data.user?.email ?? null;
    });

    this.messages$ = this.auth.observableUserDetails$.pipe(
      filter(userDetails => !!userDetails?.data.user?.id),
      switchMap(userDetails => {
        return this.chatRoom.observableMessages$;
      }),
      tap(() => setTimeout(() => this.scrollToBottom(), 0))
    );
  }

  // posteo el mensaje y lo guardo en chat_room
  private async sendMessage(): Promise<void> {
    if (this.userId && this.userEmail && this.newMessage.trim()) {
      await this.chatRoom.sendMessage(this.newMessage, this.userId, this.userEmail);
      this.newMessage = '';
    }
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

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  // muestra / oculta la ventana de chat
  public toggleChatVisibility(): void {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      this.scrollToBottom();
    }
  }

  // submit del form
  public onSubmit(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  // seek & destroy!
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
