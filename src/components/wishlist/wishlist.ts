import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../products/products';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, Products],
  templateUrl: './wishlist.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Wishlist {
  constructor(public wishlistService: WishlistService) {}
}