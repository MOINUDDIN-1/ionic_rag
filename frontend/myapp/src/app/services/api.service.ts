import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp?: string;
  source?: string;
}

export interface PDFInfo {
  filename: string;
  size: number;
  uploadedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.31.232:8000';
  private conversationId = this.initConversationId();
  
  private conversationHistory = new BehaviorSubject<ChatMessage[]>([
    {
      role: 'bot',
      text: 'Hi! I\'m StudyMate AI. Upload notes or ask me anything.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  conversationHistory$ = this.conversationHistory.asObservable();
  private pdfList = new BehaviorSubject<PDFInfo[]>([]);
  pdfList$ = this.pdfList.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private http: HttpClient) {
    this.loadPDFList();
  }

  // Initialize or get conversation ID
  private initConversationId(): string {
    let id = localStorage.getItem('conversationId');
    if (!id) {
      id = 'conv_' + Date.now();
      localStorage.setItem('conversationId', id);
    }
    return id;
  }

  // Chat endpoint with improved error handling
  async sendMessage(message: string): Promise<string> {
    this.isLoading.next(true);
    
    try {
      const response = await this.http.post<{ 
        response: string; 
        source?: string;
        timestamp?: string;
      }>(
        `${this.apiUrl}/chat`,
        { 
          message, 
          conversation_id: this.conversationId 
        }
      ).toPromise();

      if (!response?.response) {
        throw new Error('No response from server');
      }

      const botMessage: ChatMessage = {
        role: 'bot',
        text: response.response,
        timestamp: new Date().toLocaleTimeString(),
        source: response.source || 'general'
      };

      const history = this.conversationHistory.value;
      this.conversationHistory.next([...history, botMessage]);

      return response.response;
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'bot',
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
        source: 'error'
      };
      
      const history = this.conversationHistory.value;
      this.conversationHistory.next([...history, errorMessage]);
      
      throw error;
    } finally {
      this.isLoading.next(false);
    }
  }

  // Add user message to history
  addUserMessage(message: string): void {
    const userMessage: ChatMessage = {
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString()
    };

    const history = this.conversationHistory.value;
    this.conversationHistory.next([...history, userMessage]);
  }

  // Clear conversation
  clearConversation(): void {
    this.conversationId = 'conv_' + Date.now();
    localStorage.setItem('conversationId', this.conversationId);
    
    this.conversationHistory.next([
      {
        role: 'bot',
        text: 'Hi! I\'m StudyMate AI. Upload notes or ask me anything.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }

  // PDF endpoints
  uploadPDF(file: File): Observable<{ message: string; chunks?: number; size?: number }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string; chunks?: number; size?: number }>(
      `${this.apiUrl}/upload-pdf`,
      formData
    );
  }

  getPDFList(): Observable<{ pdfs: PDFInfo[] }> {
    return this.http.get<{ pdfs: PDFInfo[] }>(`${this.apiUrl}/pdfs`);
  }

  deletePDF(filename: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/pdf/${filename}`
    );
  }

  private loadPDFList(): void {
    this.getPDFList().subscribe({
      next: (data) => this.pdfList.next(data.pdfs || []),
      error: (err) => console.error('Failed to load PDF list:', err)
    });
  }

  refreshPDFList(): void {
    this.loadPDFList();
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory.value;
  }
}
