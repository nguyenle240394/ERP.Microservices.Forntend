import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule } from '@angular/forms';
import { Header, Navigation, Footer } from '@frontend/shared-ui';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, NzDatePickerModule, NzButtonModule, NzLayoutModule, FormsModule, Header, Navigation, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'host';
  date = null;
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
