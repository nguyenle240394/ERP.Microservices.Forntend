import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDatePickerModule, NzButtonModule],
  template: `
    <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant w-full">
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-headline-md font-headline-md text-on-surface mb-4">Sample Form Component</p>
          <nz-date-picker [(ngModel)]="date" class="w-full sm:w-64"></nz-date-picker>
        </div>

        <div class="mt-4 flex justify-start">
          <button nz-button nzType="primary">Xác nhận chọn</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  date = null;
}
