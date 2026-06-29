import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'lib-navigation',
  imports: [CommonModule, NzMenuModule, NzIconModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  @Input() isCollapsed = false;
  isUserMenuOpen = false;
  activeMenu = 'dashboard';

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }
}
