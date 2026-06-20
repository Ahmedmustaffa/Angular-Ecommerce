import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Products } from '../products/products';
import { DarkModeDirective } from '../../directives/dark-mode.directive';
import { IProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-master-products',
  standalone: true,
  imports: [CommonModule, FormsModule, Products, DarkModeDirective],
  templateUrl: './master-products.html',
  styleUrl: './master-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterProducts implements OnInit {
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('All');
  selectedSort = signal<string>('default');
  overallTotal = signal<number>(0);
  
  searchText = signal<string>('');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(6);
  
  private allProductsSignal = signal<IProduct[]>([]);

  filteredProducts = computed(() => {
    let temp = [...this.allProductsSignal()];
    const cat = this.selectedCategory();
    const sort = this.selectedSort();
    const query = this.searchText().trim().toLowerCase();

    // 1. Filter by category
    if (cat !== 'All') {
      temp = temp.filter(p => (p.category?.name || p.category) === cat);
    }
    
    // 2. Filter by search query (name)
    if (query) {
      temp = temp.filter(p => p.title?.toLowerCase().includes(query));
    }
    
    // 3. Sort products
    switch (sort) {
      case 'priceAsc': temp.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': temp.sort((a, b) => b.price - a.price); break;
      case 'stock': temp.sort((a, b) => b.stock - a.stock); break;
    }
    return temp;
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()));
  
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  
  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredProducts().slice(start, end);
  });

  showingFrom = computed(() => {
    if (this.filteredProducts().length === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  });

  showingTo = computed(() => {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.filteredProducts().length);
  });

  products$ = new BehaviorSubject<IProduct[]>([]);

  constructor(
    private prdService: ProductService, 
    private router: Router,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.prdService.getAllPrds().subscribe((data) => {
      this.allProductsSignal.set(data);
      const catNames = data.map(p => p.category?.name || p.category);
      this.categories.set(['All', ...new Set(catNames)]);
      this.products$.next(data);
      this.currentPage.set(1);
    });
  }

  onSearchChange(text: string) {
    this.searchText.set(text);
    this.currentPage.set(1);
  }

  onCategoryChange(cat: string) {
    this.selectedCategory.set(cat);
    this.currentPage.set(1);
  }

  onSortChange(sort: string) {
    this.selectedSort.set(sort);
    this.currentPage.set(1);
  }

  clearSearch() {
    this.searchText.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  handlePurchase(cost: number) {
    this.overallTotal.update(val => val + cost);
  }
  
  handleEdit(id: string) { 
      this.router.navigate(['/product/edit', id]); 
  }

  handleDelete(id: string) {
    this.confirmService.ask({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.prdService.deletePrdById(id).subscribe(() => {
            this.loadData();
            this.toastService.show('Product deleted successfully!', 'warning');
        });
      }
    });
  }
}