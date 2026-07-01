import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header, Navigation, Footer, AuthService } from '@frontend/shared-ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Navigation, Footer],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  private authService = inject(AuthService);

  ngOnInit() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          this.authService.setCurrentUser(JSON.parse(userStr));
        } catch {
          console.error('Failed to parse currentUser from localStorage');
        }
      } else {
        this.authService.loadCurrentUser().subscribe({
          error: (err) => console.error('Failed to restore user session', err)
        });
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
