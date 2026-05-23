import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonIcon,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, trashOutline, documentOutline } from 'ionicons/icons';
import { ApiService, PDFInfo } from '../../services/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge
  ]
})
export class UploadPage implements OnInit {
  pdfList: PDFInfo[] = [];
  isUploading = false;
  uploadProgress = 0;

  constructor(private apiService: ApiService) {
    addIcons({
      cloudUploadOutline,
      trashOutline,
      documentOutline
    });
  }

  ngOnInit(): void {
    this.apiService.pdfList$.subscribe((pdfs) => {
      this.pdfList = pdfs;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file');
      return;
    }

    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    this.isUploading = true;
    this.uploadProgress = 0;

    this.apiService.uploadPDF(file).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        alert('PDF uploaded successfully!');
        this.apiService.refreshPDFList();
        setTimeout(() => (this.uploadProgress = 0), 1000);
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Upload error:', error);
        alert('Failed to upload PDF');
      }
    });
  }

  deletePDF(filename: string): void {
    if (!confirm(`Delete ${filename}?`)) return;

    this.apiService.deletePDF(filename).subscribe({
      next: () => {
        alert('PDF deleted');
        this.apiService.refreshPDFList();
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert('Failed to delete PDF');
      }
    });
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
