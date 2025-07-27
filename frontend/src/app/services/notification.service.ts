import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  // Mantener SweetAlert2 para diálogos de confirmación
  confirmDelete(title: string = '¿Quieres eliminar el producto?', text: string = ''): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
    });
  }

  // Usar ngx-toastr para notificaciones no bloqueantes (toasts)
  showSuccess(title: string, message: string) {
    this.toastr.success(message, title);
  }

  showError(title: string, message: string) {
    this.toastr.error(message, title);
  }

  showInfo(title: string, message: string) {
    this.toastr.info(message, title);
  }

  showWarning(title: string, message: string) {
    this.toastr.warning(message, title);
  }
}
