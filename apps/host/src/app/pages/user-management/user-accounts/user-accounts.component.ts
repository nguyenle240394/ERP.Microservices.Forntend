import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserAccount {
  id: string;
  initials: string;
  fullName: string;
  email: string;
  role: string;
  roleType: 'admin' | 'editor' | 'accountant' | 'viewer';
  status: 'active' | 'disabled' | 'pending';
  createdDate: string;
  lastLogin: string;
  selected: boolean;
}

@Component({
  selector: 'app-user-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-accounts.component.html',
})
export class UserAccountsComponent {
  searchText = '';
  selectedRole = '';
  selectedStatus = '';
  showAddModal = false;
  pageSize = 10;

  users = signal<UserAccount[]>([
    { id: 'USR-001', initials: 'NA', fullName: 'Nguyễn Văn An',    email: 'nguyenvanan@adminpro.vn',  role: 'Quản trị viên', roleType: 'admin',     status: 'active',   createdDate: '15/01/2024', lastLogin: 'Hôm nay, 09:32',    selected: false },
    { id: 'USR-002', initials: 'TB', fullName: 'Trần Thị Bích',     email: 'tranthib@adminpro.vn',    role: 'Biên tập viên', roleType: 'editor',    status: 'active',   createdDate: '20/01/2024', lastLogin: 'Hôm qua, 14:15',    selected: false },
    { id: 'USR-003', initials: 'LC', fullName: 'Lê Minh Châu',      email: 'leminhc@adminpro.vn',     role: 'Người xem',     roleType: 'viewer',    status: 'disabled', createdDate: '05/02/2024', lastLogin: '12/05/2024',        selected: false },
    { id: 'USR-004', initials: 'PD', fullName: 'Phạm Quốc Dũng',   email: 'phamquocd@adminpro.vn',   role: 'Kế toán',       roleType: 'accountant',status: 'active',   createdDate: '10/03/2024', lastLogin: 'Hôm nay, 11:00',    selected: false },
    { id: 'USR-005', initials: 'HD', fullName: 'Hoàng Thị Diệu',   email: 'hoangd@adminpro.vn',      role: 'Biên tập viên', roleType: 'editor',    status: 'pending',  createdDate: '25/06/2024', lastLogin: '—',                 selected: false },
    { id: 'USR-006', initials: 'VK', fullName: 'Vũ Đình Khôi',     email: 'vukhoi@adminpro.vn',      role: 'Người xem',     roleType: 'viewer',    status: 'active',   createdDate: '01/04/2024', lastLogin: '28/06/2024',        selected: false },
    { id: 'USR-007', initials: 'DT', fullName: 'Đặng Minh Tú',     email: 'dangmt@adminpro.vn',      role: 'Quản trị viên', roleType: 'admin',     status: 'active',   createdDate: '18/02/2024', lastLogin: 'Hôm nay, 07:45',    selected: false },
  ]);

  filteredUsers = computed(() => {
    return this.users().filter(u => {
      const matchSearch = !this.searchText ||
        u.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        u.id.toLowerCase().includes(this.searchText.toLowerCase());
      const matchRole = !this.selectedRole || u.role === this.selectedRole;
      const matchStatus = !this.selectedStatus || u.status === this.selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
  });

  selectedCount = computed(() => this.users().filter(u => u.selected).length);

  stats = [
    { label: 'Tổng tài khoản', value: '1.248', icon: 'group',        colorClass: 'bg-primary/10 text-primary',   trend: '+12% so với tháng trước', trendIcon: 'trending_up', trendColor: 'text-tertiary' },
    { label: 'Đang hoạt động', value: '1.087', icon: 'check_circle', colorClass: 'bg-tertiary/10 text-tertiary', trend: '87.1% tổng số tài khoản',  trendIcon: '',            trendColor: 'text-secondary' },
    { label: 'Vô hiệu hóa',    value: '113',   icon: 'block',        colorClass: 'bg-outline/10 text-outline',   trend: '9.1% tổng số tài khoản',   trendIcon: '',            trendColor: 'text-secondary' },
    { label: 'Mới tháng này',  value: '48',    icon: 'person_add',   colorClass: 'bg-secondary-container/50 text-secondary', trend: '+8 so với tháng trước', trendIcon: 'trending_up', trendColor: 'text-tertiary' },
  ];

  roles = ['Quản trị viên', 'Biên tập viên', 'Kế toán', 'Người xem'];
  statusOptions = [
    { value: 'active',   label: 'Hoạt động' },
    { value: 'disabled', label: 'Vô hiệu hóa' },
    { value: 'pending',  label: 'Chờ xác nhận' },
  ];

  // Add form
  newUser = { firstName: '', lastName: '', email: '', phone: '', role: '', status: 'active' };

  resetFilters() {
    this.searchText = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }

  toggleAll(checked: boolean) {
    this.users.update(users => users.map(u => ({ ...u, selected: checked })));
  }

  toggleSelect(id: string) {
    this.users.update(users => users.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
  }

  get allChecked(): boolean {
    return this.users().length > 0 && this.users().every(u => u.selected);
  }

  get indeterminate(): boolean {
    const count = this.selectedCount();
    return count > 0 && count < this.users().length;
  }

  getRoleBadgeClass(roleType: string): string {
    const map: Record<string, string> = {
      admin:     'bg-primary/10 text-primary border border-primary/20',
      editor:    'bg-surface-container-high text-on-surface-variant border border-outline-variant',
      accountant:'bg-tertiary/10 text-tertiary border border-tertiary/20',
      viewer:    'bg-surface-container-high text-on-surface-variant border border-outline-variant',
    };
    return map[roleType] || map['viewer'];
  }

  getStatusConfig(status: string) {
    const map: Record<string, { label: string; dotClass: string; textClass: string }> = {
      active:   { label: 'Hoạt động',    dotClass: 'bg-tertiary',  textClass: 'text-tertiary' },
      disabled: { label: 'Vô hiệu hóa', dotClass: 'bg-outline',   textClass: 'text-outline' },
      pending:  { label: 'Chờ xác nhận', dotClass: 'bg-amber-600', textClass: 'text-amber-600' },
    };
    return map[status] || map['disabled'];
  }

  getAvatarClass(roleType: string): string {
    const map: Record<string, string> = {
      admin:     'bg-primary/15 text-primary',
      editor:    'bg-secondary-container/60 text-secondary',
      accountant:'bg-tertiary/15 text-tertiary',
      viewer:    'bg-outline/15 text-outline',
    };
    return map[roleType] || map['viewer'];
  }

  submitAddUser() {
    this.showAddModal = false;
    this.newUser = { firstName: '', lastName: '', email: '', phone: '', role: '', status: 'active' };
  }
}
