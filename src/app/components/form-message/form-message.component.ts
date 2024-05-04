import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormMessage } from './FormMessage';

@Component({
  selector: 'app-form-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-message.component.html',
  styleUrl: './form-message.component.css'
})
export class FormMessageComponent {
  @Input() formMessage!: FormMessage;
}
