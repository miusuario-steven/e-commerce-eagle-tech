import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastType } from '../../../services/notification.service'; // ✅ ruta relativa

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  message = signal('');
  type = signal<ToastType>('info');
  visible = signal(false);

  constructor(private notification: NotificationService) {
    effect(() => {
      this.notification.toast$.subscribe((data: { message: string; type: ToastType }) => {
        this.message.set(data.message);
        this.type.set(data.type);
        this.visible.set(true);
        setTimeout(() => this.visible.set(false), 4000);
      });
    });
  }
}
