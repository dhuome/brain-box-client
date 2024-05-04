import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './services/token/token.interceptor';
import { provideAngularQuery, QueryClient } from '@tanstack/angular-query-experimental';

const maskConfigFunction: () => Partial<IConfig> = () => ({
  validation: false
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAngularQuery(new QueryClient()),
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom([HttpClientModule]),
    provideAnimations(),
    provideEnvironmentNgxMask(maskConfigFunction),
    provideHttpClient(withInterceptors([
      tokenInterceptor,
    ])),
  ]
};
