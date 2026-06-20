import { Component, OnInit, ChangeDetectionStrategy, signal, ChangeDetectorRef } from '@angular/core'; // Import signal helper
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm implements OnInit {
  newPrd: IProduct = { title: '', description: '', category: '', price: 0, stock: 0, thumbnail: '' };
  currentId: string = '';
  isEditMode: boolean = false;
  
  // 1. Create a Signal to store categories
  categories = signal<any[]>([]);

  constructor(
    private prdService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // 2. Fetch categories from server on load
    this.prdService.getAllCategories().subscribe(data => {
      this.categories.set(data);
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.currentId = idParam;
        this.isEditMode = true;
        
        this.prdService.getPrdById(this.currentId).subscribe((existingPrd) => {
           const catValue = existingPrd.category?._id || existingPrd.category;
           this.newPrd = { ...existingPrd, category: catValue };
           this.cdr.markForCheck();
        });
      }
    });
  }

  handleSubmit(): void {
    if (this.isEditMode) {
      this.prdService.editPrd(this.currentId, this.newPrd).subscribe(() => {
        this.toastService.show('Product updated successfully!', 'success');
        this.router.navigate(['/products']);
      });
    } else {
      this.prdService.createPrd(this.newPrd).subscribe(() => {
        this.toastService.show('Product created successfully!', 'success');
        this.router.navigate(['/products']);
      });
    }
  }
}