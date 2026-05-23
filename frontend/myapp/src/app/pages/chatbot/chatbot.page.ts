import { Component } from '@angular/core';

import {
  IonContent,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-chatbot',

  template: `
    <ion-content>
      <div style="padding: 24px;">
        Chatbot Page
      </div>
    </ion-content>
  `,

  standalone: true,

  imports: [
    IonContent,
  ],
})
export class ChatbotPage {}