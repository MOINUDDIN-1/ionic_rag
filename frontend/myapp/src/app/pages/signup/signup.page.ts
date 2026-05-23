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
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
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
export class SignupPage {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(private router: Router) {}

  signup(): void {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email: this.email, fullName: this.fullName }));
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 500);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
