import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {
  @Input() isDisabled = false;
  @Input({ required: true }) message!: string;
  @Input({ required: true }) headerTitle!: string;
  @Input({ required: true }) cancelTitle!: string;
  @Input({ required: true }) actionTitle!: string;

  @Output() triggerFunc = new EventEmitter();
  @Output() triggerCancel = new EventEmitter();
}
