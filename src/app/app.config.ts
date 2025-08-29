import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "games-room-e14a5", appId: "1:111147840913:web:8b4b93fffa1031fffc5630", storageBucket: "games-room-e14a5.firebasestorage.app", apiKey: "AIzaSyATV4qGY17G2OtYGcxujYV-Zm8Hy02hhFM", authDomain: "games-room-e14a5.firebaseapp.com", messagingSenderId: "111147840913" })), provideAuth(() => getAuth())
  ]
};
