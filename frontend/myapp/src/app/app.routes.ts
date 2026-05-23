import {
  Routes,
} from '@angular/router';

import {
  authGuard,
} from './core/guards/auth.guard';


export const routes: Routes = [

  {
    path: '',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/home/home.page').then(
        (module) => module.HomePage,
      ),
  },

  {
    path: 'login',

    loadComponent: () =>
      import('./pages/login/login.page').then(
        (module) => module.LoginPage,
      ),
  },

  {
    path: 'documents',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/documents/documents.page').then(
        (module) => module.DocumentsPage,
      ),
  },

  {
    path: 'chatbot',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/chatbot/chatbot.page').then(
        (module) => module.ChatbotPage,
      ),
  },

  {
    path: '**',

    redirectTo: '',
  },
];