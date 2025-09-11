import { Routes } from '@angular/router';

export const routes: Routes = [
    // public routes
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome'
    },
    {
        path: 'welcome',
        title: 'Bienvenido',
        loadComponent: () => import('./components/welcome/welcome').then(c => c.Welcome)
    },
    {
        path: 'login',
        title: 'Iniciar sesion',
        loadComponent: () => import('./components/auth/login/login').then(c => c.Login)
    },
    {
        path: 'register',
        title: 'Registro',
        loadComponent: () => import('./components/auth/register/register').then(c => c.Register)
    },
    {
        path: 'about',
        title: 'Acerca de',
        loadComponent: () => import('./components/about/about').then(c => c.About)
    },

    // private routes
    {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('./components/home/home').then(c => c.Home)
    },
    {
        path: 'games',
        title: 'Juegos',
        loadChildren: () => import('./modules/games/games-module').then(m => m.GamesModule)
    },

    // page not found (404)
    {
        path: '**',
        title: 'Pagina no encontrada',
        loadComponent: () => import('./components/page-not-found/page-not-found').then(c => c.PageNotFound)
    }
];
