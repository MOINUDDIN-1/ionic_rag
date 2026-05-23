import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonSpinner
} from '@ionic/angular/standalone';
import { ProfileService, StudentProfile } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonSpinner
  ]
})
export class ProfilePage implements OnInit {
  profile: StudentProfile = {
    fullName: '',
    email: '',
    department: '',
    semester: '',
    collegeName: '',
    bio: ''
  };

  isEditing = false;
  isSaving = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profile = { ...this.profileService.getProfile() };
  }

  editProfile(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    if (!this.validateProfile()) {
      alert('Please fill in all fields');
      return;
    }

    this.isSaving = true;
    setTimeout(() => {
      this.profileService.updateProfile(this.profile);
      this.isSaving = false;
      this.isEditing = false;
      alert('Profile updated successfully!');
    }, 500);
  }

  cancelEdit(): void {
    this.profile = { ...this.profileService.getProfile() };
    this.isEditing = false;
  }

  resetProfile(): void {
    if (!confirm('Reset to default profile?')) return;
    this.profileService.resetProfile();
    this.profile = { ...this.profileService.getProfile() };
    this.isEditing = false;
  }

  private validateProfile(): boolean {
    return !!(
      this.profile.fullName &&
      this.profile.email &&
      this.profile.department &&
      this.profile.semester &&
      this.profile.collegeName
    );
  }

  getInitials(): string {
    return this.profile.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
