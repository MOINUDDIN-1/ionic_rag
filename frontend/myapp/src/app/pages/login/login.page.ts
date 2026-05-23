import { Component } from '@angular/core';

import {
    FormsModule,
} from '@angular/forms';

import {
    Router,
} from '@angular/router';

import { CommonModule } from '@angular/common';
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonText,
} from '@ionic/angular/standalone';


interface UserCredentials {

    user_id: string;

    email: string;

    password: string;
}



@Component({
    selector: 'app-login',

    templateUrl: './login.page.html',

    styleUrls: ['./login.page.scss'],

    standalone: true,


    imports: [
        CommonModule,

        FormsModule,

        IonContent,
        IonInput,
        IonItem,
        IonLabel,
        IonButton,
        IonText,
    ],
})
export class LoginPage {

    loginId = '';

    password = '';

    errorMessage = '';



    private credentials: UserCredentials[] = [

        {
            user_id: 'admin',

            email: 'admin@example.com',

            password: 'admi',
        },

        {
            user_id: 'moin',

            email: 'moin@example.com',

            password: 'moin123',
        },
    ];


    constructor(
        private router: Router
    ) { }


    login() {

        this.errorMessage = '';

        if (!this.loginId.trim()) {

            this.errorMessage =
                'Please enter User ID or Email';

            return;
        }

        if (!this.password.trim()) {

            this.errorMessage =
                'Please enter Password';

            return;
        }

        const user = this.credentials.find(
            (item) =>
                item.user_id === this.loginId ||
                item.email === this.loginId
        );

        if (!user) {

            this.errorMessage =
                'Invalid Credentials';

            return;
        }

        if (user.password !== this.password) {

            this.errorMessage =
                'Invalid Credentials';

            return;
        }

        localStorage.setItem(
            'isLoggedIn',
            'true'
        );

        localStorage.setItem(
            'userId',
            user.user_id
        );

        localStorage.setItem(
            'userEmail',
            user.email
        );
        localStorage.setItem(
            'userName',
            user.user_id
        );

        this.router.navigate(['/']);
    }

}
