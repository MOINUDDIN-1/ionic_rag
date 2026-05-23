import { Component } from '@angular/core';

import {
    Router,
} from '@angular/router';

import {
    IonButton,
    IonContent,
} from '@ionic/angular/standalone';


@Component({
    selector: 'app-home',

    templateUrl: './home.page.html',

    styleUrls: ['./home.page.scss'],

    standalone: true,

    imports: [
        IonContent,
        IonButton,
    ],
})
export class HomePage {

    userName = '';


    constructor(
        private router: Router
    ) {

        this.userName =
            localStorage.getItem(
                'userName'
            ) || 'User';
    }


    openChatbot() {

        this.router.navigate([
            '/chatbot'
        ]);
    }


    openDocuments() {

        this.router.navigate([
            '/documents'
        ]);
    }


    logout() {

        localStorage.clear();

        this.router.navigate([
            '/login'
        ]);
    }
}