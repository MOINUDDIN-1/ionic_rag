import {
    Injectable,
} from '@angular/core';

import {
    HttpClient,
} from '@angular/common/http';

import {
    Observable,
} from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ChatService {

    private apiUrl =
        'http://127.0.0.1:8000/api/v1';


    constructor(
        private http: HttpClient,
    ) { }


    createConversation(
        userId: string,
    ): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/conversations?user_id=${userId}`,
            {},
        );
    }


    getConversations(
        userId: string,
    ): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/conversations?user_id=${userId}`,
        );
    }


    getMessages(
        conversationId: string,
        userId: string,
    ): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/conversations/${conversationId}?user_id=${userId}`,
        );
    }


    sendMessage(
        payload: {
            conversation_id: string;
            user_id: string;
            message: string;
            k?: number;
        },
    ): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/chat`,
            payload,
        );
    }


    deleteConversation(
        conversationId: string,
        userId: string,
    ): Observable<any> {

        return this.http.delete(
            `${this.apiUrl}/conversations/${conversationId}?user_id=${userId}`,
        );
    }


    speechToText(
        audio: Blob,
    ): Observable<any> {

        const formData = new FormData();

        formData.append(
            'audio',
            audio,
            'recording.webm',
        );

        return this.http.post(
            `${this.apiUrl}/chat/speech-to-text`,
            formData,
        );
    }


    generateAudio(
        text: string,
    ): Observable<Blob> {

        return this.http.post(
            `${this.apiUrl}/chat/audio`,
            {
                text,
            },
            {
                responseType: 'blob',
            },
        );
    }
}