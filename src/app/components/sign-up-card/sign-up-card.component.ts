/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/components/input/input.component';
import { lastValueFrom } from 'rxjs';
import { Regex, Validation } from 'src/app/app.constants';
import { InputError } from 'src/app/types/utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormMessageComponent } from 'src/app/components/form-message/form-message.component';
import { FormMessage } from '../form-message/FormMessage';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast.service';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { CreateUserRequest } from 'src/app/types/auth';

interface SingUpForm {
  username: FormControl<string>;
  mobileNumber: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-up-card',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, FormMessageComponent],
  templateUrl: './sign-up-card.component.html',
  styleUrl: './sign-up-card.component.css'
})
export class SignUpCardComponent {
  regex = Regex;

  formMessage = new FormMessage;

  @Output() closeModal = new EventEmitter();
  @Output() loginStep = new EventEmitter();

  singUpForm = new FormGroup<SingUpForm>({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)], nonNullable: true
    }),
    mobileNumber: new FormControl('', {
      validators: [Validators.required, Validators.pattern(Regex.PHONE_NUMBER)], nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email], nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)], nonNullable: true
    })
  });

  usernameErrors: InputError[] = [
    { message: 'Please Enter Your Username', type: Validation.REQUIRED },
    { message: 'Min Username Length is 2 Characters', type: Validation.MIN_LENGTH },
  ];

  mobileNumberErrors: InputError[] = [
    { message: 'Please Enter Your Mobile Number', type: Validation.REQUIRED },
    { message: 'Pattern error: Correct example 50-000-0000', type: Validation.PATTERN },
  ];

  emailErrors: InputError[] = [
    { message: 'Please Enter Your Email', type: Validation.REQUIRED },
    { message: 'Incorrect Email Pattern Ex: Test@test.com', type: Validation.EMAIL },
  ];

  passwordErrors: InputError[] = [
    { message: 'Please Enter Your Password', type: Validation.REQUIRED },
    { message: 'Min Password Length is 8 Digits', type: Validation.MIN_LENGTH },
  ];

  createUserMutation = injectMutation(() => ({
    mutationFn: (createUserRequest: CreateUserRequest) => lastValueFrom(
      this.authService.createUser(createUserRequest)
    )
  }));

  constructor(private authService: AuthService, private toastService: ToastService) { }

  onSignUp() {
    const { username, mobileNumber, email, password } = this.singUpForm.getRawValue();

    if (!username?.length || !mobileNumber?.length || !email?.length || !password?.length) {
      this.formMessage.setFailureMessage('Please fill out all required fields');
      return;
    }

    if (!this.singUpForm.valid) {
      this.formMessage.setFailureMessage(
        'Apologies, there is an error in one of the inputs. Please correct it to complete the process.'
      );
      return;
    }

    this.formMessage.clear();
    this.createUserMutation.mutate({ email, mobileNumber, password, username }, {
      onSuccess: () => {
        this.closeModal.emit();
        this.singUpForm.reset();
        this.toastService.addSuccessToast('🚀 Account created successfully! Welcome aboard!');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.formMessage.setHttpFailureMessage(error);
        }
      }
    });
  }
}
