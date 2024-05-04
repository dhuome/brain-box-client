import { Component } from '@angular/core';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(public navigationService: NavigationService) { }
}
