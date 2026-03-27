import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  success(title: string, message: string = '') {
    this.toast.fire({
      icon: 'success',
      title: title,
      text: message,
      showCloseButton: true
    });
  }

  error(title: string, message: string = '') {
    this.toast.fire({
      icon: 'error',
      title: title,
      text: message
    });
  }

  show(icon: SweetAlertIcon, title: string) {
    this.toast.fire({ icon, title });
  }
}
