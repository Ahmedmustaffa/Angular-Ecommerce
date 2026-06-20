import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrders implements OnInit {
  orders = signal<any[]>([]);
  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadAllOrders();
  }

  loadAllOrders() {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders.set(data);
    });
  }

  changeStatus(orderId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toastService.show('Order status updated successfully!', 'success');
        this.loadAllOrders();
      },
      error: () => {
        this.toastService.show('Failed to update status.', 'danger');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Processing': return 'bg-info text-white';
      case 'Shipped': return 'bg-primary text-white';
      case 'Delivered': return 'bg-success text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
