import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/api/wishlist';

  wishlistItems = signal<IProduct[]>([]);
  
  wishlistCount = computed(() => this.wishlistItems().length);

  constructor(private http: HttpClient, private toastService: ToastService) {}

  loadWishlist() {
    if (localStorage.getItem('token')) {
      this.http.get<IProduct[]>(this.apiUrl).subscribe(items => {
        this.wishlistItems.set(items);
      });
    }
  }

  toggleWishlist(product: IProduct) {
    const currentItems = this.wishlistItems();
    const exists = currentItems.some(item => item._id === product._id);

    if (exists) {
      this.http.delete<{message: string, wishlist: IProduct[]}>(`${this.apiUrl}/remove/${product._id}`)
        .subscribe(res => {
          this.wishlistItems.set(res.wishlist); 
          this.toastService.show(`Removed "${product.title}" from wishlist 🤍`, 'warning');
        });
    } else {
      this.http.post<{message: string, wishlist: IProduct[]}>(`${this.apiUrl}/add`, { productId: product._id })
        .subscribe(res => {
          this.wishlistItems.set(res.wishlist);
          this.toastService.show(`Added "${product.title}" to wishlist ❤️`, 'success');
        });
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some(item => item._id === productId);
  }
}