import {
    Component,
    OnInit,
} from '@angular/core';

import {
    CommonModule,
} from '@angular/common';

import {
    HttpClientModule,
} from '@angular/common/http';

import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonSpinner,
    IonTitle,
    IonToolbar,
} from '@ionic/angular/standalone';

import {
    Router,
} from '@angular/router';

import {
    addIcons,
} from 'ionicons';

import {
    chatbubbleEllipsesOutline,
    cloudUploadOutline,
    documentOutline,
    logOutOutline,
    refreshOutline,
    trashOutline,
} from 'ionicons/icons';

import {
    finalize,
} from 'rxjs';

import {
    DocumentService,
} from 'src/app/core/services/document.service';


@Component({
    selector: 'app-documents',

    templateUrl: './documents.page.html',

    styleUrls: ['./documents.page.scss'],

    standalone: true,

    imports: [
        CommonModule,
        HttpClientModule,

        IonContent,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonCard,
        IonCardContent,
        IonIcon,
        IonSpinner,
    ],
})
export class DocumentsPage implements OnInit {

    documents: {
        filename: string;
    }[] = [];

    isLoading = false;

    isUploading = false;

    isReindexing = false;

    selectedFiles: File[] = [];

    status: any = null;

    backendConnected = true;

    errorMessage = '';

    successMessage = '';


    constructor(
        private router: Router,
        private documentService: DocumentService,
    ) {

        addIcons({
            trashOutline,
            cloudUploadOutline,
            refreshOutline,
            logOutOutline,
            documentOutline,
            chatbubbleEllipsesOutline,
        });
    }


    ngOnInit(): void {

        this.refreshBackend();
    }
    setError(
        message: string
    ): void {

        this.errorMessage = message;

        this.successMessage = '';

        setTimeout(() => {

            this.errorMessage = '';

        }, 3000);
    }


    setSuccess(
        message: string
    ): void {

        this.successMessage = message;

        this.errorMessage = '';

        setTimeout(() => {

            this.successMessage = '';

        }, 3000);
    }


    clearMessages(): void {

        this.errorMessage = '';

        this.successMessage = '';
    }


    refreshBackend(): void {

        this.backendConnected = true;

        this.loadDocuments();

        this.loadStatus();
    }


    loadDocuments(): void {

        this.isLoading = true;

        this.documentService
            .getDocuments()
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({

                next: (response) => {

                    this.backendConnected = true;

                    this.documents =
                        response.documents || [];
                },

                error: (error) => {

                    console.error(error);
                    this.setError(
                        error?.error?.detail ||
                        'Something went wrong'
                    );

                    this.backendConnected = false;
                },
            });
    }


    loadStatus(): void {

        this.documentService
            .getRagStatus()
            .subscribe({

                next: (response) => {

                    this.backendConnected = true;

                    this.status = response;
                },

                error: (error) => {

                    console.error(error);

                    this.backendConnected = false;
                },
            });
    }


    onFilesSelected(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;

        if (!input.files) {
            return;
        }

        this.selectedFiles =
            Array.from(input.files);
    }


    uploadDocuments(): void {

        if (!this.selectedFiles.length) {
            return;
        }

        this.isUploading = true;

        this.documentService
            .uploadDocuments(this.selectedFiles)
            .pipe(
                finalize(() => {
                    this.isUploading = false;
                })
            )
            .subscribe({

                next: () => {
                    this.setSuccess(
                        'Documents uploaded successfully'
                    );

                    this.selectedFiles = [];

                    this.loadDocuments();

                    this.loadStatus();
                },

                error: (error) => {
                    this.setError(
                        error?.error?.detail ||
                        'Failed to upload documents'
                    );

                    console.error(error);
                },
            });
    }


    deleteDocument(
        filename: string
    ): void {

        const confirmed = confirm(
            `Delete ${filename}?`
        );

        if (!confirmed) {
            return;
        }

        this.documentService
            .deleteDocument(filename)
            .subscribe({

                next: () => {
                    this.setSuccess(
                        'Document deleted successfully'
                    );

                    this.loadDocuments();

                    this.loadStatus();
                },

                error: (error) => {
                    this.setError(
                        error?.error?.detail ||
                        'Failed to delete document'
                    );

                    console.error(error);
                },
            });
    }


    deleteAllDocuments(): void {

        const confirmed = confirm(
            'Delete all documents?'
        );

        if (!confirmed) {
            return;
        }

        this.documentService
            .deleteAllDocuments()
            .subscribe({

                next: () => {
                    this.setSuccess(
                        'Documents deleted successfully'
                    );

                    this.documents = [];

                    this.loadStatus();
                },

                error: (error) => {
                    this.setError(
                        error?.error?.detail ||
                        'Failed to delete documents'
                    );

                    console.error(error);
                },
            });
    }


    rebuildIndex(): void {

        this.isReindexing = true;

        this.documentService
            .rebuildIndex()
            .pipe(
                finalize(() => {
                    this.isReindexing = false;
                })
            )
            .subscribe({

                next: () => {
                    this.setSuccess(
                        'Rebuilt index successfully'
                    );

                    this.loadStatus();
                },

                error: (error) => {
                    this.setError(
                        error?.error?.detail ||
                        'Failed to Rebuild index'
                    );

                    console.error(error);
                },
            });
    }


    openChatbot(): void {

        this.router.navigate([
            '/chatbot'
        ]);
    }


    logout(): void {

        localStorage.clear();

        this.router.navigate([
            '/login'
        ]);
    }
}