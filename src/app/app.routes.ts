import { Routes } from '@angular/router';

export const routes: Routes = [
    // rutas publicas
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
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
    }
];
