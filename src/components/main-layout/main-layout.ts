import { Component, OnInit, HostListener, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CurrencyPipe],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  isAdmin = localStorage.getItem('userRole') === 'admin';
  showScroll = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.showScroll.set(window.scrollY > 300);
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  constructor(
    private router: Router, 
    public wishlistService: WishlistService,
    public cartService: CartService,
    public toastService: ToastService,
    public confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.wishlistService.loadWishlist();
    this.cartService.loadCart(); 
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}