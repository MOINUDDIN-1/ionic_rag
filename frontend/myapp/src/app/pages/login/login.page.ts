import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel
  ]
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;

  constructor(private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email: this.email }));
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 500);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
