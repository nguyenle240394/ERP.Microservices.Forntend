import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService as AppAuthService, CurrentUser } from '@frontend/shared-ui';

interface LoginResponse {
  message?: string;
  isAuthenticated?: boolean;
  currentUser?: CurrentUser;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  isUsernameFocused = false;
  isPasswordFocused = false;
  passwordType: 'password' | 'text' = 'password';
  isBrowser = false;
  
  username = '';
  password = '';
  rememberMe = false;
  isLoading = false;
  
  private authSubscription!: Subscription;
  private authService = inject(SocialAuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private message = inject(NzMessageService);
  private appAuthService = inject(AppAuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) { // ← wrap lại
      this.authSubscription = this.authService.authState.subscribe((user) => {
        if (user) {
          console.log('Google User:', user);
          this.isLoading = true;
          this.http.post('https://localhost:44317/api/account/google-login', { idToken: user.idToken }, { withCredentials: true })
            .subscribe({
              next: (res: LoginResponse) => {
                console.log('Backend response:', res);
                if (res.currentUser) {
                  this.appAuthService.setCurrentUser(res.currentUser);
                } else {
                  localStorage.setItem('isAuthenticated', 'true');
                }
                this.isLoading = false;
                this.cdr.detectChanges();
                this.router.navigate(['/']);
              },
              error: (err) => {
                console.error('Backend login failed', err);
                this.message.error('Đăng nhập thất bại!');
                this.isLoading = false;
              }
            });
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  login() {
    if (!this.username || !this.password) {
      this.message.warning('Vui lòng nhập tên đăng nhập và mật khẩu!');
      return;
    }

    const payload = { 
      userNameOrEmailAddress: this.username, 
      password: this.password, 
      rememberMe: this.rememberMe 
    };

    this.isLoading = true;
    this.cdr.detectChanges();
    console.log('Sending login request to backend...', payload);

    // NOTE: Cập nhật URL endpoint theo API backend của bạn
    this.http.post('https://localhost:44317/api/auth/login', payload, { withCredentials: true })
      .subscribe({
        next: (res: LoginResponse) => {
          console.log('Login success:', res);
          if (res.currentUser) {
            this.appAuthService.setCurrentUser(res.currentUser);
          } else {
            localStorage.setItem('isAuthenticated', 'true');
          }
          this.isLoading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
