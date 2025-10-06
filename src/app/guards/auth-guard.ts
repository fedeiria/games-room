import { inject } from '@angular/core';
import { filter, map, Observable, switchMap, take } from 'rxjs';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { Auth } from '../services/supabase/auth/auth';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree => {

  const auth = inject(Auth);
  const router = inject(Router);

  return auth.observableAuthReady$.pipe(
    // solo continua cuando isReady es true
    filter(isReady => isReady),

    //una vez listo cambio el observable
    switchMap(() => auth.observableUserDetails$),

    // tomo el primer estado
    take(1),

    // si hay un usuario logueado permito el acceso
    map(userLoggued => {
      if (userLoggued) {
        return true;
      }
      else {
        router.createUrlTree(['/welcome']);
        return false;
      }
    })
  );
};
