import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminUser } from '../../core/services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  message: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.message = 'Error al cargar los usuarios.';
        this.loading = false;
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (confirm(`¿Eliminar al usuario "${user.username}"?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.message = `✅ Usuario "${user.username}" eliminado.`;
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (err) => {
          console.error('❌ Error al eliminar usuario:', err);
          this.message = 'Error al eliminar el usuario.';
        }
      });
    }
  }

  toggleStatus(user: AdminUser): void {
    this.adminService.toggleUserStatus(user.id, !user.enabled).subscribe({
      next: (updated) => {
        user.enabled = updated.enabled;
      },
      error: (err) => {
        console.error('❌ Error al cambiar estado del usuario:', err);
      }
    });
  }
}
