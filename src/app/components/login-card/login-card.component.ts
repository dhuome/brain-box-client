/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/components/input/input.component';
import { lastValueFrom } from 'rxjs';
import { Regex, Validation, Routes } from 'src/app/app.constants';
import { InputError } from 'src/app/types/utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormMessageComponent } from 'src/app/components/form-message/form-message.component';
import { FormMessage } from '../form-message/FormMessage';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast.service';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { LoginRequest } from 'src/app/types/auth';
import { Router } from '@angular/router';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, FormMessageComponent],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css'
})
export class LoginCardComponent {
  regex = Regex;

  formMessage = new FormMessage;

  @Output() closeModal = new EventEmitter();
  @Output() singUpStep = new EventEmitter();

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email], nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)], nonNullable: true
    })
  });

  emailErrors: InputError[] = [
    { message: 'Please Enter Your Email', type: Validation.REQUIRED },
    { message: 'Incorrect Email Pattern Ex: Test@test.com', type: Validation.EMAIL },
  ];

  passwordErrors: InputError[] = [
    { message: 'Please Enter Your Password', type: Validation.REQUIRED },
    { message: 'Min Password Length is 8 Digits', type: Validation.MIN_LENGTH },
  ];

  queryClient = injectQueryClient();
  loginMutation = injectMutation(() => ({
    mutationFn: (loginRequest: LoginRequest) => lastValueFrom(
      this.authService.login(loginRequest)
    )
  }));

  constructor(private authService: AuthService, private toastService: ToastService, private router: Router) { }

  onLogin() {
    const { email, password } = this.loginForm.getRawValue();

    if (!email?.length || !password?.length) {
      this.formMessage.setFailureMessage('Please fill out all required fields');
      return;
    }

    if (!this.loginForm.valid) {
      this.formMessage.setFailureMessage(
        'Apologies, there is an error in one of the inputs. Please correct it to complete the process.'
      );
      return;
    }

    this.formMessage.clear();
    this.loginMutation.mutate({ email, password }, {
      onSuccess: () => {
        this.closeModal.emit();
        this.loginForm.reset();
        this.router.navigate([Routes.PREFIX]);
        this.queryClient.invalidateQueries({ queryKey: ['articles'] });
        this.toastService.addSuccessToast('🎉 Login successful! Welcome back!');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.formMessage.setHttpFailureMessage(error);
        }
      }
    });
  }
}
