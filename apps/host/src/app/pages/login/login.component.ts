import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  isEmailFocused = false;
  isPasswordFocused = false;
  passwordType: 'password' | 'text' = 'password';
  
  private authSubscription!: Subscription;
  private authService = inject(SocialAuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe((user) => {
      if (user) {
        console.log('Google User:', user);
        // Call backend API with the Google ID Token
        this.http.post('https://localhost:44317/api/account/google-login', { idToken: user.idToken }, { withCredentials: true })
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

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
}
