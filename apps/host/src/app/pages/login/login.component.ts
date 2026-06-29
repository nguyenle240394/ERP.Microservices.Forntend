import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) { // ← wrap lại
      this.authSubscription = this.authService.authState.subscribe((user) => {
        if (user) {
          console.log('Google User:', user);
          this.isLoading = true;
          this.http.post('https://localhost:44317/api/account/google-login', { idToken: user.idToken }, { withCredentials: true })
            .pipe(finalize(() => { this.isLoading = false; }))
            .subscribe({
              next: (res: unknown) => {
                console.log('Backend response:', res);
                localStorage.setItem('isAuthenticated', 'true');
                this.router.navigate(['/']);
              },
              error: (err) => {
                console.error('Backend login failed', err);
                alert('Login failed!');
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
      alert('Vui lòng nhập tên đăng nhập và mật khẩu!');
      return;
    }

    const payload = { 
      userNameOrEmailAddress: this.username, 
      password: this.password, 
      rememberMe: this.rememberMe 
    };

    this.isLoading = true;

    // NOTE: Cập nhật URL endpoint theo API backend của bạn
    this.http.post('https://localhost:44317/api/auth/login', payload, { withCredentials: true })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res: unknown) => {
          console.log('Login success:', res);
          localStorage.setItem('isAuthenticated', 'true');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
      });
  }
}
