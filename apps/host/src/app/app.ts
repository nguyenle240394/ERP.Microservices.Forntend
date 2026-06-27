import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterModule, NzDatePickerModule, NzButtonModule, FormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'host';
  date = null;
}
