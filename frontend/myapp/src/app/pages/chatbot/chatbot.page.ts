import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  finalize,
} from 'rxjs';

import {
  addIcons,
} from 'ionicons';

import {
  menuOutline,
  addOutline,
  sendOutline,
  micOutline,
  stopOutline,
  volumeHighOutline,
  pauseOutline,
  trashOutline,
  logOutOutline,
  homeOutline,
} from 'ionicons/icons';

import {
  Router,
} from '@angular/router';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuButton,
  IonSpinner,
  IonSplitPane,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import {
  ChatService,
} from 'src/app/core/services/chat.service';


@Component({
  selector: 'app-chatbot',

  standalone: true,

  templateUrl: './chatbot.page.html',

  styleUrls: ['./chatbot.page.scss'],

  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonMenu,
    IonSplitPane,
    IonMenuButton,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonTextarea,
    IonSpinner,
    IonIcon,
  ],
})
export class ChatbotPage implements OnInit {

  userId =
    localStorage.getItem('userId') || '';

  userEmail =
    localStorage.getItem('userEmail') || '';


  conversations: any[] = [];

  messages: any[] = [];


  currentConversationId = '';

  prompt = '';


  isLoadingMessages = false;

  isSending = false;

  isRecording = false;

  isSpeechProcessing = false;


  mediaRecorder!: MediaRecorder;

  audioChunks: Blob[] = [];


  audioCache =
    new Map<string, HTMLAudioElement>();

  currentlyPlayingText = '';

  loadingAudioText = '';


  constructor(
    private chatService: ChatService,
    private router: Router,
  ) {

    addIcons({

      'menu-outline': menuOutline,

      'add-outline': addOutline,

      'send-outline': sendOutline,

      'mic-outline': micOutline,

      'stop-outline': stopOutline,

      'volume-high-outline': volumeHighOutline,

      'pause-outline': pauseOutline,

      'trash-outline': trashOutline,

      'log-out-outline': logOutOutline,
      'home-outline': homeOutline,
    });
  }


  ngOnInit(): void {

    this.loadConversations();
  }


  loadConversations(): void {

    this.chatService
      .getConversations(this.userId)
      .subscribe({

        next: (response) => {

          this.conversations = response;

          if (
            response.length &&
            !this.currentConversationId
          ) {

            this.openConversation(
              response[0].id,
            );
          }
        },
      });
  }


  createConversation(): void {

    this.chatService
      .createConversation(this.userId)
      .subscribe({

        next: (conversation) => {

          this.conversations.unshift(
            conversation,
          );

          this.currentConversationId =
            conversation.id;

          this.messages = [];
        },
      });
  }


  openConversation(
    conversationId: string,
  ): void {

    this.currentConversationId =
      conversationId;

    this.isLoadingMessages = true;

    this.chatService
      .getMessages(
        conversationId,
        this.userId,
      )
      .pipe(
        finalize(() => {

          this.isLoadingMessages = false;
        }),
      )
      .subscribe({

        next: (response) => {

          this.messages = response;
        },
      });
  }


  sendMessage(): void {

    if (
      !this.prompt.trim() ||
      !this.currentConversationId
    ) {
      return;
    }

    const message = this.prompt;

    this.messages.push({
      role: 'user',
      content: message,
    });

    this.prompt = '';

    this.isSending = true;

    this.chatService
      .sendMessage({
        conversation_id:
          this.currentConversationId,

        user_id: this.userId,

        message,

        k: 3,
      })
      .pipe(
        finalize(() => {

          this.isSending = false;
        }),
      )
      .subscribe({

        next: (response) => {

          this.messages.push({
            role: 'assistant',
            content: response.response,
            sources: response.sources,
          });

          this.loadConversations();
        },
      });
  }


  async toggleRecording(): Promise<void> {

    if (this.isRecording) {

      this.mediaRecorder.stop();

      this.isRecording = false;

      return;
    }

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    this.audioChunks = [];

    this.mediaRecorder =
      new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (
      event,
    ) => {

      this.audioChunks.push(
        event.data,
      );
    };

    this.mediaRecorder.onstop = () => {

      const audioBlob = new Blob(
        this.audioChunks,
        {
          type: 'audio/webm',
        },
      );

      this.isSpeechProcessing = true;

      this.chatService
        .speechToText(audioBlob)

        .subscribe({

          next: async (response) => {

            const incomingText =
              response.text || '';

            this.prompt =
              this.prompt.trim()
                ? `${this.prompt} ${incomingText}`
                : incomingText;

            await new Promise(
              (resolve) =>
                requestAnimationFrame(resolve),
            );

            this.isSpeechProcessing = false;
          },
        });
    };

    this.mediaRecorder.start();

    this.isRecording = true;
  }


  toggleAudio(
    text: string,
  ): void {

    const cachedAudio =
      this.audioCache.get(text);

    if (cachedAudio) {

      if (
        this.currentlyPlayingText === text
      ) {

        cachedAudio.pause();

        this.currentlyPlayingText = '';

        return;
      }

      cachedAudio.play();

      this.currentlyPlayingText = text;

      return;
    }

    this.loadingAudioText = text;

    this.chatService
      .generateAudio(text)
      .pipe(
        finalize(() => {

          this.loadingAudioText = '';
        }),
      )
      .subscribe({

        next: (blob) => {

          const url =
            URL.createObjectURL(blob);

          const audio =
            new Audio(url);

          audio.onended = () => {

            this.currentlyPlayingText = '';
          };

          audio.play();

          this.currentlyPlayingText = text;

          this.audioCache.set(
            text,
            audio,
          );
        },
      });
  }


  deleteConversation(
    conversationId: string,
  ): void {

    this.chatService
      .deleteConversation(
        conversationId,
        this.userId,
      )
      .subscribe({

        next: () => {

          this.conversations =
            this.conversations.filter(
              (conversation) =>
                conversation.id !==
                conversationId,
            );

          if (
            this.currentConversationId ===
            conversationId
          ) {

            this.messages = [];

            this.currentConversationId = '';
          }
        },
      });
  }


  logout(): void {

    localStorage.clear();

    this.router.navigate([
      '/login',
    ]);
  }
  goHome(): void {

    this.router.navigate([
      '/',
    ]);
  }
}