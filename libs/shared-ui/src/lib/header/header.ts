import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'lib-header',
  imports: [CommonModule, NzIconModule, NzDropdownModule, NzAvatarModule, NzMenuModule, NzButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  currentUser$ = this.authService.currentUser$;

  logout() {
    this.authService.setCurrentUser(null);
    try {
      this.socialAuthService.signOut().catch(err => console.warn('Google sign out error/not signed in', err));
    } catch (e) {
      console.warn('Google sign out sync error', e);
    }
    this.router.navigate(['/login']);
  }
}
