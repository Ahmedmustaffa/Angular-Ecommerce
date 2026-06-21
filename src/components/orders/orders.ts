import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Orders implements OnInit {
  orders = signal<any[]>([]);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(data => {
      this.orders.set(data);
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
