import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { authState } from 'rxfire/auth';
import { from, map, switchMap } from 'rxjs';

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const injector = inject(Injector);
    const auth = inject(Auth);
    const firestore = inject(Firestore);
    const router = inject(Router);

    return authState(auth).pipe(
      switchMap(user => {
        if (!user) {
          router.navigate(['/login']);
          return from([false]);
        }

        // Call getDoc within Angular injection context
        return from(
          runInInjectionContext(injector, async () => {
            const userDocRef = doc(firestore, `users/${user.uid}`);
            const userDoc = await getDoc(userDocRef);
            return userDoc;
          })
        ).pipe(
          map(docSnap => {
            const role = docSnap.data()?.['role'];
            if (role === expectedRole) {
              return true;
            } else {
              router.navigate(['/unauthorized']);
              return false;
            }
          })
        );
      })
    );
  };
}
