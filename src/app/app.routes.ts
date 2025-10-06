import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    // public routes
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/welcome/welcome').then(c => c.Welcome)
        //redirectTo: 'welcome'
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
        loadComponent: () => import('./components/home/home').then(c => c.Home),
        canActivate:[authGuard]
    },
    // load module: gamesModule
    {
        path: 'games',
        title: 'Juegos',
        loadChildren: () => import('./modules/games/games-module').then(m => m.GamesModule),
        canActivate:[authGuard]
    },

    // page not found (404)
    {
        path: '**',
        title: 'Pagina no encontrada',
        loadComponent: () => import('./components/page-not-found/page-not-found').then(c => c.PageNotFound)
    }
];
