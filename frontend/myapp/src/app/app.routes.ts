import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [

  {
    path: '',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/home/home.page').then(
        (m) => m.HomePage
      ),
  },

  {
    path: 'login',

    loadComponent: () =>
      import('./pages/login/login.page').then(
        (m) => m.LoginPage
      ),
  },

  {
    path: 'chatbot',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/chatbot/chatbot.page').then(
        (m) => m.ChatbotPage
      ),
  },

  {
    path: 'documents',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/documents/documents.page').then(
        (m) => m.DocumentsPage
      ),
  },

  {
    path: '**',

    redirectTo: '',
  },
];