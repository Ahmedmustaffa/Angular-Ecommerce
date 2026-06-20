import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cart {
  shippingAddress: string = '';
  showAddressError = signal<boolean>(false);

  constructor(
    public cartService: CartService, 
    private router: Router,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  removeItem(productId: string) {
    this.confirmService.ask({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.cartService.removeFromCart(productId);
        this.toastService.show('Product removed from cart', 'warning');
      }
    });
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      this.cartService.updateCartItemQuantity(item.product._id, item.quantity - 1);
    }
  }

  increaseQty(item: any) {
    if (item.quantity < item.product.stock) {
      this.cartService.updateCartItemQuantity(item.product._id, item.quantity + 1);
    }
  }

  onAddressChange(val: string) {
    this.shippingAddress = val;
    if (val.trim()) {
      this.showAddressError.set(false);
    }
  }

  handleCheckout() {
    if (!this.shippingAddress.trim()) {
      this.showAddressError.set(true);
      this.toastService.show('Shipping address is required!', 'danger');
      return;
    }
    this.showAddressError.set(false);

    this.cartService.checkout(this.shippingAddress).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.toastService.show('Order placed successfully! 📦', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.toastService.show('Failed to place order. Please try again.', 'danger');
      }
    });
  }
}