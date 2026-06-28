import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { EMPTY } from 'rxjs';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: SocialAuthService,
      useValue: {
        authState: EMPTY,
        initState: EMPTY,
        signIn: () => Promise.resolve(),
        signOut: () => Promise.resolve(),
        refreshAuthToken: () => Promise.resolve(),
        refreshAccessToken: () => Promise.resolve(),
        getAccessToken: () => Promise.resolve()
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
