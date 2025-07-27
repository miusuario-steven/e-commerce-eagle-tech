import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('token');
    }
    return false;
  }

  watchLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, JSON.stringify(value));
      if (key === 'token') {
        this.isLoggedIn$.next(true);
      }
    }
  }

  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(key);
      if (key === 'token') {
        this.isLoggedIn$.next(false);
      }
    }
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
      this.isLoggedIn$.next(false);
    }
  }
}
