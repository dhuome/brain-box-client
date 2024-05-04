/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent {
  fileError = '';

  @Input() file: File | null = null;
  @Input({ required: true }) controlName!: string;
  @Input() formGroupDirective!: FormGroupDirective;

  @Output() triggerDelete = new EventEmitter();
  @Output() triggerSave = new EventEmitter<File>();

  onSelectFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files) { return; }

    // eslint-disable-next-line prefer-destructuring
    const file = inputElement.files[0];
    const fileExtension = file.name.split('.').pop()
      ?.toLowerCase() || '';
    const acceptedFormats = ['.svg', '.png', '.jpg', '.jpeg'];

    if (!acceptedFormats.includes(`.${fileExtension}`)) {
      this.fileError = 'Oops! This file format is not supported. Please choose a different file.';
      inputElement.value = '';
      return;
    }

    if (file.size > 500 * 1024) {
      this.fileError = 'File size exceeds 500 KB. Please select a smaller file.';
      return;
    }

    this.fileError = '';
    this.triggerSave.emit(file);
  }
}
