import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StudentProfile {
  fullName: string;
  email: string;
  department: string;
  semester: string;
  collegeName: string;
  bio: string;
  avatar?: string;
}

const DEFAULT_PROFILE: StudentProfile = {
  fullName: 'Student',
  email: 'student@college.com',
  department: 'Computer Science',
  semester: '5th',
  collegeName: 'Your College',
  bio: 'Passionate learner'
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<StudentProfile>(
    this.loadProfile()
  );
  profile$ = this.profileSubject.asObservable();

  constructor() {}

  private loadProfile(): StudentProfile {
    const stored = localStorage.getItem('studentProfile');
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  }

  getProfile(): StudentProfile {
    return this.profileSubject.value;
  }

  updateProfile(profile: StudentProfile): void {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    this.profileSubject.next(profile);
  }

  resetProfile(): void {
    localStorage.removeItem('studentProfile');
    this.profileSubject.next(DEFAULT_PROFILE);
  }
}
