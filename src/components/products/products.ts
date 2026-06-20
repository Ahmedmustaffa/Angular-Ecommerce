import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/product.model';
import { TruncateWordsPipe } from '../../pipes/truncate.pipe';
import { ZoomDirective } from '../../directives/zoom.directive';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncateWordsPipe, ZoomDirective],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products {
  @Input() products: IProduct[] = [];
  @Output() buyEvent = new EventEmitter<number>();
  
  @Output() editEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();

  quantities: { [id: string]: number } = {};
  expandedDesc: Set<string> = new Set();

  isAdmin = localStorage.getItem('userRole') === 'admin';

  constructor(
    public wishlistService: WishlistService, 
    private cartService: CartService,
    private toastService: ToastService
  ) { }
  
  getQuantity(id: string | undefined): number {
    if (!id) return 1;
    if (!this.quantities[id]) this.quantities[id] = 1;
    return this.quantities[id];
  }

  increase(p: IProduct) {
    if (!p._id) return;
    const current = this.getQuantity(p._id);
    if (current < p.stock) this.quantities[p._id] = current + 1;
  }

  decrease(p: IProduct) {
    if (!p._id) return;
    const current = this.getQuantity(p._id);
    if (current > 1) this.quantities[p._id] = current - 1;
  }

  toggleDescription(id: string | undefined) {
    if (!id) return;
    if (this.expandedDesc.has(id)) {
      this.expandedDesc.delete(id);
    } else {
      this.expandedDesc.add(id);
    }
  }

  buyProduct(p: IProduct) {
    if (!p._id) return;
    const q = this.getQuantity(p._id);
    if (q > 0 && q <= p.stock) {
      this.cartService.addToCart(p._id, q);
      this.toastService.show('product added', 'success');
      p.stock -= q; 
      this.quantities[p._id] = 1; 
    }
  }
}