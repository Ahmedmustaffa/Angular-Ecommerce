import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard implements OnInit {
  categories = signal<any[]>([]);
  newCategoryName = '';

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:3000/api/categories').subscribe(data => {
      this.categories.set(data);
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.http.post('http://localhost:3000/api/categories', { name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      this.loadCategories();
      this.toastService.show('Category added successfully! 🎉', 'success');
    });
  }

  deleteCategory(id: string) {
    this.confirmService.ask({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.http.delete(`http://localhost:3000/api/categories/${id}`).subscribe(() => {
          this.loadCategories();
          this.toastService.show('Category deleted successfully!', 'warning');
        });
      }
    });
  }
}