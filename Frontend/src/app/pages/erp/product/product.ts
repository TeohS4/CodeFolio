import { Component, inject, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PAGES_IMPORTS } from '../../pages.imports';
import { ProductService } from '../../../core/services/erp/product-service/product-service';
import { AlertService } from '../../../core/services/alert-service/alert';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild('productDialog') productDialog!: TemplateRef<any>;

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  displayedColumns: string[] = ['sku',
    'name',
    'category',
    'price',
    'stockQuantity',
    'createdAt',
    'updatedAt',
    'actions'];
  isEdit = false;

  form = this.fb.group({
    id: [0],
    sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\-]+$/), Validators.maxLength(8)]],
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.productService.getAll().subscribe({
      next: (res: any[]) => {
        this.products = res.map(p => ({
          id: p.id ?? (p as any).Id,
          name: p.name ?? (p as any).Name,
          sku: p.sku ?? (p as any).SKU,
          category: p.category ?? (p as any).Category,
          price: p.price ?? (p as any).Price,
          stockQuantity: p.stockQuantity ?? (p as any).StockQuantity,
          createdAt: p.createdAt ?? (p as any).CreatedAt,
          updatedAt: p.updatedAt ?? (p as any).UpdatedAt
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'Could not load inventory');
        this.cdr.detectChanges();
      }
    });
  }

  openDialog(product?: any) {
    this.isEdit = !!product;

    if (product) {
      this.form.patchValue(product);
    } else {
      this.form.reset({ id: 0, name: '', sku: '', category: '', price: 0, stockQuantity: 0 });
    }

    const dialogRef = this.dialog.open(this.productDialog, {
      width: '500px',
      panelClass: 'dark-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.form.reset();
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  save() {
    if (this.form.invalid) return;

    const raw = this.form.value;
    const data: Product = {
      id: raw.id ?? undefined,
      name: raw.name ?? '',
      sku: raw.sku ?? '',
      category: raw.category ?? '',
      price: raw.price ?? 0,
      stockQuantity: raw.stockQuantity ?? 0
    };

    const request = this.isEdit
      ? this.productService.update(data.id!, data)
      : this.productService.create(data);

    request.subscribe({
      next: () => {
        this.alertService.success(this.isEdit ? 'Product Updated' : 'Product Added');
        this.load();
        this.dialog.closeAll();
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('System Error', 'Save failed');
        this.cdr.detectChanges();
      }
    });
  }

  delete(id: number) {
    if (confirm('Delete this product? This will affect stock records.')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.alertService.success('Deleted', 'Product removed from inventory');
          this.load();
          this.cdr.detectChanges();
        },
        error: () => {
          this.alertService.error('Error', 'Delete failed');
          this.cdr.detectChanges();
        }
      });
    }
  }
}
