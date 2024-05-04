import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from 'src/app/types/utils';

export class FormMessage {
  message: string | null;
  apiMessage: ErrorResponse | null;

  constructor() {
    this.message = null;
    this.apiMessage = null;
  }

  clear() {
    this.message = null;
    this.apiMessage = null;
  }

  setFailureMessage(message: string) {
    this.clear();
    this.message = message;
  }

  setHttpFailureMessage({ error, status }: HttpErrorResponse) {
    const apiError = error as ErrorResponse;
    this.clear();

    // network failure handler
    // eslint-disable-next-line no-magic-numbers
    if (status === 0) {
      this.setFailureMessage('There has been a problem with the server. Please contact your service provider');
      return;
    }

    this.apiMessage = { errorMessages: apiError.errorMessages };
  }
}
