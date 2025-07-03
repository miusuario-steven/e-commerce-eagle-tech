import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _toast$ = new Subject<{ message: string; type: ToastType }>();

  toast$ = this._toast$.asObservable();

  show(message: string, type: ToastType = 'info') {
    this._toast$.next({ message, type });
  }
}
