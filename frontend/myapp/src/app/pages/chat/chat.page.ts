import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  IonAvatar,
  IonBadge,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, hardwareChipOutline, personOutline, documentsOutline, documentTextOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api.service';

export interface ChatSource {
  filename: string;
  score: number;
  pageContent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp?: string;
  source?: 'pdf' | 'general';
  sources?: ChatSource[];
  isStreaming?: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonTextarea,
    IonButton,
    IonIcon,
    IonSpinner,
    IonAvatar,
    IonBadge,
    IonButtons
  ]
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  isThinking = false;
  private messageId = 0;

  constructor(private apiService: ApiService) {
    addIcons({
      sendOutline,
      hardwareChipOutline,
      personOutline,
      documentsOutline,
      documentTextOutline
    });
  }

  ngOnInit(): void {
    // Initialize with welcome message
    this.messages = [
      {
        id: this.generateId(),
        role: 'bot',
        text: '👋 Welcome to StudyMate RAG Assistant! Upload your PDF notes or ask me questions about your study materials.',
        timestamp: new Date().toLocaleTimeString()
      }
    ];

    this.apiService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
      if (!loading) {
        this.isThinking = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.userInput = '';

    // Add user message
    const userMsg: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString()
    };
    this.messages.push(userMsg);
    this.scrollToBottom();

    // Show thinking state
    this.isThinking = true;
    this.scrollToBottom();

    try {
      const response = await this.apiService.sendMessage(message);
      this.isThinking = false;

      // Create bot message with sources if available
      const botMsg: ChatMessage = {
        id: this.generateId(),
        role: 'bot',
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        source: this.extractSource(response),
        sources: this.extractSources(response)
      };

      this.messages.push(botMsg);
    } catch (error) {
      this.isThinking = false;
      console.error('Error sending message:', error);

      const errorMsg: ChatMessage = {
        id: this.generateId(),
        role: 'bot',
        text: '❌ Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      this.messages.push(errorMsg);
    }

    this.scrollToBottom();
  }

  showDocuments(): void {
    // Navigate to upload page or show PDFs modal
    // This can be expanded later
    console.log('Show documents clicked');
  }

  private extractSource(response: string): 'pdf' | 'general' | undefined {
    // In production, this would come from API response
    // For now, we can parse it from the message or store it in the service
    return undefined;
  }

  private extractSources(response: string): ChatSource[] {
    // In production, this would come from API response
    // For now, return empty array
    return [];
  }

  private generateId(): string {
    return `msg_${++this.messageId}`;
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        const container = this.messageContainer?.nativeElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  clearChat(): void {
    if (confirm('Clear all chat history?')) {
      this.messages = [
        {
          id: this.generateId(),
          role: 'bot',
          text: '👋 Welcome to StudyMate RAG Assistant! Upload your PDF notes or ask me questions about your study materials.',
          timestamp: new Date().toLocaleTimeString()
        }
      ];
    }
  }
}
