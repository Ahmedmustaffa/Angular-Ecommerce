import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private orderUrl = 'http://localhost:3000/api/orders';

  cartItems = signal<any[]>([]);
  totalPrice = signal<number>(0);

  cartCount = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  constructor(private http: HttpClient) {}

  loadCart() {
    if (localStorage.getItem('token')) {
      this.http.get<any>(this.apiUrl).subscribe(cart => {
        if (cart) {
          this.cartItems.set(cart.items || []);
          this.totalPrice.set(cart.totalPrice || 0);
        }
      });
    }
  }

  addToCart(productId: string, quantity: number) {
    this.http.post<any>(`${this.apiUrl}/add`, { productId, quantity }).subscribe(() => {
      this.loadCart();
    });
  }

  updateCartItemQuantity(productId: string, quantity: number) {
    this.http.put<any>(`${this.apiUrl}/update`, { productId, quantity }).subscribe(() => {
      this.loadCart();
    });
  }

  removeFromCart(productId: string) {
    this.http.delete<any>(`${this.apiUrl}/remove/${productId}`).subscribe(() => {
      this.loadCart();
    });
  }

  checkout(shippingAddress: string) {
    return this.http.post<any>(`${this.orderUrl}/checkout`, { shippingAddress });
  }

  clearCart() {
    this.cartItems.set([]);
    this.totalPrice.set(0);
  }
}