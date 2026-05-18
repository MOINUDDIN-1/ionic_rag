import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonInput,
    IonButton
  ],
})
export class HomePage {

  userInput = '';

  messages: ChatMessage[] = [
    {
      role: 'bot',
      text: 'Hello 👋 Ask me anything.'
    }
  ];

  async sendMessage() {

    if (!this.userInput.trim()) {
      return;
    }

    const userMessage = this.userInput;

    this.messages.push({
      role: 'user',
      text: userMessage
    });

    this.userInput = '';

    try {

      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await response.json();

      this.messages.push({
        role: 'bot',
        text: data.response
      });

    } catch (error) {

      this.messages.push({
        role: 'bot',
        text: 'Backend connection failed.'
      });

      console.error(error);
    }
  }
}