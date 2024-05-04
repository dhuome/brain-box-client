import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ToastType } from 'src/app/types/utils';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  type = ToastType;

  constructor(public toastService: ToastService) { }

  getIconSrc(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return 'assets/icons/success.svg';
      case ToastType.ERROR:
        return 'assets/icons/error.svg';
      case ToastType.WARNING:
        return 'assets/icons/warning.svg';
      case ToastType.INFO:
        return 'assets/icons/info.svg';
      default:
        return '';
    }
  }
}
