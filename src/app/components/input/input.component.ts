import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InputError } from 'src/app/types/utils';

type InputType = 'text' | 'password';

const MAX_LENGTH = 16;

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  isDisabled = false;
  isPasswordShown = false;

  @Input() placeholder = '';
  @Input() isMandatory = false;
  @Input() errors!: InputError[];
  @Input() allowedRegex!: string;
  @Input() isPhoneNumber = false;
  @Input() maxLength = MAX_LENGTH;
  @Input() type: InputType = 'text';
  @Input({ required: true }) label!: string;
  @Input({ required: true }) controlName!: string;
  @Input() formGroupDirective!: FormGroupDirective;

  fieldError(errorType: string) {
    return this.formGroupDirective.form.get(this.controlName)?.errors?.[errorType]
      && (this.formGroupDirective.form.get(this.controlName)?.touched || this.formGroupDirective.submitted);
  }

  onInputChange(value: string | undefined) {
    return !this.allowedRegex || (value && new RegExp(this.allowedRegex).test(value));
  }

  get filteredError() {
    if (!this.errors) {
      return [];
    }
    return this.errors.filter((error) => this.fieldError(error.type));
  }
}
