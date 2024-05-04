import { Component, signal } from '@angular/core';
import { fadeInOut } from 'src/app/animations/fadeInOut';
import { LoginCardComponent } from 'src/app/components/login-card/login-card.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignUpCardComponent } from 'src/app/components/sign-up-card/sign-up-card.component';
import { ConfirmationPopupComponent } from 'src/app/components/confirmation-popup/confirmation-popup.component';
import { Authorities, Routes } from 'src/app/app.constants';
import { ArticleCardComponent } from 'src/app/components/article-card/article-card.component';
import { RouterLink } from '@angular/router';
import { injectQueryClient } from '@tanstack/angular-query-experimental';

enum AuthStep {
  LOGIN,
  SIGN_UP
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LoginCardComponent, SignUpCardComponent, ConfirmationPopupComponent, ArticleCardComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [fadeInOut]
})
export class HeaderComponent {
  routes = Routes;
  authStep = AuthStep;
  authorities = Authorities;

  ActiveAuthStep = AuthStep.LOGIN;
  queryClient = injectQueryClient();

  isAuthPopupActive = signal<boolean>(false);
  isPostArticlePopupActive = signal<boolean>(false);
  isConfirmationPopupActive = signal<boolean>(false);

  constructor(public authService: AuthService) { }

  onLogout() {
    this.authService.clearAuth();
    this.isConfirmationPopupActive.set(false);
    this.queryClient.invalidateQueries({ queryKey: ['articles'] });
  }
}
