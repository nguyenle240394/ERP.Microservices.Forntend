import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '@frontend/shared-ui';

interface IdentityRoleDto {
  id: string;
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
  creationTime: string;
  extraProperties: Record<string, unknown>;
}

interface PagedResultDto {
  items: IdentityRoleDto[];
  totalCount: number;
}

interface PermissionGrantInfoDto {
  name: string;
  displayName: string;
  parentName: string | null;
  isGranted: boolean;
  allowedProviders: string[];
  grantedProviders: unknown[];
  isEditable: boolean;
}

interface PermissionGroupDto {
  name: string;
  displayName: string;
  displayNameKey: string;
  displayNameResource: string;
  permissions: PermissionGrantInfoDto[];
}

interface GetPermissionListResultDto {
  entityDisplayName: string;
  groups: PermissionGroupDto[];
}

@Component({
  selector: 'app-user-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-groups.component.html',
})
export class UserGroupsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  // State
  roles = signal<IdentityRoleDto[]>([]);
  totalCount = signal(0);
  loading = signal(false);
  searchText = '';

  // Pagination
  currentPage = signal(1);
  pageSize = 10;

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize) || 1);
  paginationRange = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });
  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize, this.totalCount()));

  // Modal
  showModal = signal(false);
  isEditing = signal(false);
  editingRole = signal<IdentityRoleDto | null>(null);
  formData = { name: '', isDefault: false, isPublic: false };
  saving = signal(false);

  // Delete confirmation
  showDeleteConfirm = signal(false);
  deletingRole = signal<IdentityRoleDto | null>(null);

  // Permissions Modal
  showPermissionsModal = signal(false);
  editingPermissionsRole = signal<IdentityRoleDto | null>(null);
  permissionGroups = signal<PermissionGroupDto[]>([]);
  savingPermissions = signal(false);
  permissionsLoading = signal(false);

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading.set(true);
    const skip = (this.currentPage() - 1) * this.pageSize;
    let params = new HttpParams()
      .set('SkipCount', skip.toString())
      .set('MaxResultCount', this.pageSize.toString());

    if (this.searchText.trim()) {
      params = params.set('Filter', this.searchText.trim());
    }

    this.http.get<PagedResultDto>(`${this.apiUrl}/api/identity/roles`, { params, withCredentials: true })
      .subscribe({
        next: (result) => {
          console.log('API Result:', result);
          const res = result as unknown as Record<string, unknown>;
          this.roles.set(result.items || (res['Items'] as IdentityRoleDto[]) || []);
          this.totalCount.set(result.totalCount ?? (res['TotalCount'] as number) ?? 0);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadRoles();
  }

  goToPage(page: number | '...') {
    if (page === '...' || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadRoles();
  }

  goFirst() {
    if (this.currentPage() === 1) return;
    this.currentPage.set(1);
    this.loadRoles();
  }

  goLast() {
    if (this.currentPage() === this.totalPages()) return;
    this.currentPage.set(this.totalPages());
    this.loadRoles();
  }

  goPrev() {
    if (this.currentPage() <= 1) return;
    this.currentPage.set(this.currentPage() - 1);
    this.loadRoles();
  }

  goNext() {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.set(this.currentPage() + 1);
    this.loadRoles();
  }

  // CRUD
  openAddModal() {
    this.isEditing.set(false);
    this.editingRole.set(null);
    this.formData = { name: '', isDefault: false, isPublic: false };
    this.showModal.set(true);
  }

  openEditModal(role: IdentityRoleDto) {
    this.isEditing.set(true);
    this.editingRole.set(role);
    this.formData = { name: role.name, isDefault: role.isDefault, isPublic: role.isPublic };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingRole.set(null);
  }

  submitForm() {
    if (!this.formData.name.trim()) return;
    this.saving.set(true);

    if (this.isEditing()) {
      const role = this.editingRole();
      if (!role) return;
      const body = {
        name: this.formData.name,
        isDefault: this.formData.isDefault,
        isPublic: this.formData.isPublic,
        concurrencyStamp: role.concurrencyStamp,
      };
      this.http.put<IdentityRoleDto>(`${this.apiUrl}/api/identity/roles/${role.id}`, body, { withCredentials: true })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.closeModal();
            this.loadRoles();
          },
          error: () => {
            this.saving.set(false);
          }
        });
    } else {
      const body = {
        name: this.formData.name,
        isDefault: this.formData.isDefault,
        isPublic: this.formData.isPublic,
      };
      this.http.post<IdentityRoleDto>(`${this.apiUrl}/api/identity/roles`, body, { withCredentials: true })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.closeModal();
            this.currentPage.set(1);
            this.loadRoles();
          },
          error: () => {
            this.saving.set(false);
          }
        });
    }
  }

  confirmDelete(role: IdentityRoleDto) {
    this.deletingRole.set(role);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.deletingRole.set(null);
  }

  executeDelete() {
    const role = this.deletingRole();
    if (!role) return;
    this.http.delete(`${this.apiUrl}/api/identity/roles/${role.id}`, { withCredentials: true })
      .subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.deletingRole.set(null);
          this.loadRoles();
        },
        error: () => {
          this.showDeleteConfirm.set(false);
          this.deletingRole.set(null);
        }
      });
  }

  // Permissions Management
  openPermissionsModal(role: IdentityRoleDto) {
    this.editingPermissionsRole.set(role);
    this.showPermissionsModal.set(true);
    this.permissionsLoading.set(true);
    
    const params = new HttpParams()
      .set('providerName', 'R')
      .set('providerKey', role.name);

    this.http.get<GetPermissionListResultDto>(`${this.apiUrl}/api/permission-management/permissions`, { params, withCredentials: true })
      .subscribe({
        next: (result) => {
          this.permissionGroups.set(result.groups);
          this.permissionsLoading.set(false);
        },
        error: () => {
          this.permissionsLoading.set(false);
        }
      });
  }

  closePermissionsModal() {
    this.showPermissionsModal.set(false);
    this.editingPermissionsRole.set(null);
    this.permissionGroups.set([]);
  }

  togglePermission(groupIndex: number, permIndex: number, checked: boolean) {
    this.permissionGroups.update(groups => {
      const newGroups = [...groups];
      newGroups[groupIndex].permissions[permIndex].isGranted = checked;
      return newGroups;
    });
  }

  savePermissions() {
    const role = this.editingPermissionsRole();
    if (!role) return;
    
    this.savingPermissions.set(true);
    
    const params = new HttpParams()
      .set('providerName', 'R')
      .set('providerKey', role.name);

    const permissions = this.permissionGroups().flatMap(g => 
      g.permissions.map(p => ({ name: p.name, isGranted: p.isGranted }))
    );

    const body = { permissions };

    this.http.put(`${this.apiUrl}/api/permission-management/permissions`, body, { params, withCredentials: true })
      .subscribe({
        next: () => {
          this.savingPermissions.set(false);
          this.closePermissionsModal();
        },
        error: () => {
          this.savingPermissions.set(false);
        }
      });
  }

  getRoleIcon(role: IdentityRoleDto): string {
    if (role.isStatic) return 'admin_panel_settings';
    if (role.isDefault) return 'verified_user';
    return 'badge';
  }

  getRoleIconClass(role: IdentityRoleDto): string {
    if (role.isStatic) return 'bg-primary/10 text-primary';
    return 'bg-secondary-container/30 text-secondary';
  }

  getRoleIconFill(role: IdentityRoleDto): string {
    if (role.isStatic) return "'FILL' 1";
    return "'FILL' 0";
  }
}
