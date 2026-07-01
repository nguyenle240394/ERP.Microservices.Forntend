import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lib-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive, NzMenuModule, NzIconModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation implements OnInit {
  @Input() isCollapsed = false;
  isUserMenuOpen = false;

  private router = inject(Router);

  get isUserManagementActive(): boolean {
    return this.router.url.startsWith('/user-management');
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isUserManagementActive) {
        this.isUserMenuOpen = true;
      } else {
        this.isUserMenuOpen = false;
      }
    });

    if (this.isUserManagementActive) {
      this.isUserMenuOpen = true;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    
    // Nếu mở menu mà chưa ở trong trang user-management, điều hướng đến trang đó 
    // để cập nhật màu active ngay lập tức (và bỏ màu active ở Dashboard)
    if (this.isUserMenuOpen && !this.isUserManagementActive) {
      this.router.navigate(['/user-management']);
    }
  }
}
