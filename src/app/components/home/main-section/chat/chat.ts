import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Auth } from '../../../../services/supabase/auth/auth';
import { ChatRoom } from '../../../../services/supabase/database/chat-room/chat-room';
import { IChatMessage } from '../../../../interfaces/chat-room/ichat-message';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnDestroy, OnInit {

  public newMessage: string = '';
  public messages: IChatMessage[] = [];

  public currentUserId: string | null = null;
  public currentUserEmail: string | null = null;

  private messagesSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;

  public isChatVisible: boolean = false;

  @ViewChild('messageContainer') private messageContainerRef!: ElementRef<HTMLDivElement>;

  constructor(private auth: Auth, private chatRoom: ChatRoom) { }

  ngOnInit() {
    this.messagesSubscription = this.chatRoom.observableMessages$.subscribe(messages => {
      this.messages = messages;

      setTimeout(() => {
        this.scrollToBottom()
      }, 50);
    });

    this.userSubscription = this.auth.observableUserDetails$.subscribe(userDetails => {
      const user = userDetails?.data.user;

      this.currentUserId = user?.id ?? null;
      this.currentUserEmail = user?.email ?? null;
    });
  }

  // envio el mensaje al chat
  public async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      await this.chatRoom.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }

  // lleva el scroll de la ventana del chat hacia abajo
  private scrollToBottom(): void {
    if (this.messageContainerRef) {
      try {
        this.messageContainerRef.nativeElement.scrollTo({ top: this.messageContainerRef.nativeElement.scrollHeight, behavior: 'smooth' });
      }
      catch (error) {
        console.log('error de scroll');
      }
    }
  }

  // muestra / oculta la ventana de chat
  public toggleChatVisibility(): void {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 50);
    }
  }

  // submit del form
  public onSubmit(event: Event): void {
    event.preventDefault();
    this.sendMessage();
  }

  // seek & destroy!
  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
