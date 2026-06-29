import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNzI18n, vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { GoogleLoginProvider, SocialAuthServiceConfig, SOCIAL_AUTH_CONFIG } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { API_URL } from '@frontend/shared-ui';


import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  DashboardOutline,
  UserOutline,
  SettingOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  DownOutline,
  CalendarOutline,
  EyeOutline,
  EyeInvisibleOutline,
  LockOutline,
  MailOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  DashboardOutline,
  UserOutline,
  SettingOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  BellOutline,
  DownOutline,
  CalendarOutline,
  EyeOutline,
  EyeInvisibleOutline,
  LockOutline,
  MailOutline
];

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideNzI18n(vi_VN),
    provideNzIcons(icons),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '930802791773-2djt1o4nuqr9p6u4je5vm6mit3epr3vo.apps.googleusercontent.com',
              {
                oneTapEnabled: false
              }
            )
          }
        ],
        onError: (err: unknown) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },
    {
      provide: API_URL,
      useValue: environment.apiUrl
    }
  ]
};
