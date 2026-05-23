import {
    Injectable,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    Observable,
} from 'rxjs';

import {
    environment,
} from 'src/environments/environment';


@Injectable({
    providedIn: 'root',
})
export class DocumentService {

    private readonly apiUrl =
        environment.apiUrl;


    constructor(
        private http: HttpClient
    ) { }


    getDocuments(): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/documents`
        );
    }


    uploadDocuments(
        files: File[]
    ): Observable<any> {

        const formData = new FormData();

        files.forEach((file) => {
            formData.append(
                'files',
                file
            );
        });

        return this.http.post(
            `${this.apiUrl}/documents/upload`,
            formData
        );
    }


    deleteDocument(
        filename: string
    ): Observable<any> {

        return this.http.delete(
            `${this.apiUrl}/documents/${filename}`
        );
    }


    deleteAllDocuments(): Observable<any> {

        return this.http.delete(
            `${this.apiUrl}/documents/all`
        );
    }


    rebuildIndex(): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/rag/reindex`,
            {}
        );
    }


    getRagStatus(): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/rag/status`
        );
    }
}