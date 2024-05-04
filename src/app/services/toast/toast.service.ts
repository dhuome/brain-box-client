import { Injectable, OnDestroy, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ErrorResponse, ToastType } from 'src/app/types/utils';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string | null;
  apiMessage: ErrorResponse | null;
}

const FADE_TIMEOUT = 3000;

@Injectable({
  providedIn: 'root'
})
export class ToastService implements OnDestroy {
  // eslint-disable-next-line no-magic-numbers
  private id = 1;
  messages = signal<ToastMessage[]>([]);

  timerSub?: Subscription;

  private addToast(message: string | null, type: ToastType, apiMessage: ErrorResponse | null): void {
    const existingToast = this.messages().find(
      (toast) => toast.message === message
        && toast.type === type
        && ((toast.apiMessage === null && apiMessage === null)
          || (toast.apiMessage?.errorMessages === apiMessage?.errorMessages))
    );

    if (!existingToast) {
      const newToast: ToastMessage = {
        id: this.id++,
        message,
        type,
        apiMessage
      };

      this.messages.update(() => [...this.messages(), newToast]);
      this.removeToastWithTimer(newToast.id);
    }
  }

  addSuccessToast(message: string | null) {
    this.addToast(message, ToastType.SUCCESS, null);
  }

  addErrorToast(message: string | null) {
    this.addToast(message, ToastType.ERROR, null);
  }

  addInfoToast(message: string | null) {
    this.addToast(message, ToastType.INFO, null);
  }

  addWarningToast(message: string | null) {
    this.addToast(message, ToastType.WARNING, null);
  }

  addHttpSuccessToast(apiMessage: ErrorResponse | null) {
    this.addToast(null, ToastType.SUCCESS, apiMessage);
  }

  addHttpErrorToast(apiMessage: ErrorResponse | null) {
    this.addToast(null, ToastType.ERROR, apiMessage);
  }

  removeToastWithTimer(id: number): void {
    this.timerSub = timer(FADE_TIMEOUT).subscribe(() => {
      this.removeToast(id);
    });
  }

  removeToast(id: number): void {
    this.messages.update((value) => value.filter((toast) => toast.id !== id));
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}
