import { Component, inject, OnInit, ChangeDetectorRef, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PAGES_IMPORTS } from '../../pages.imports';
import { OrderService } from '../../../core/services/erp/order-service/order-service';
import { CustomerService } from '../../../core/services/erp/customer-service/customer-service';
import { ProductService } from '../../../core/services/erp/product-service/product-service';
import { OrderItemService } from '../../../core/services/erp/order-item-service/order-item-service';
import { forkJoin, Observable } from 'rxjs';
import { AlertService } from '../../../core/services/alert-service/alert';
import { Order } from '../../../core/interfaces/order.interface';
import { CartItem, OrderItem } from '../../../core/interfaces/order-item.interface';
import { Customer } from '../../../core/interfaces/customer.intertface';
import { Product } from '../../../core/interfaces/product.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [...PAGES_IMPORTS, MatDialogModule],
  templateUrl: './order.html',
  styleUrls: ['./order.scss'],
})
export class OrderComponent implements OnInit {
  @ViewChild('orderDialog') orderDialog!: TemplateRef<any>;
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private orderItemService = inject(OrderItemService);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  customers: Customer[] = [];
  products: Product[] = [];
  // items: OrderItem[] = [];
  selectedOrder: Order | null = null;
  selectedOrderItems: OrderItem[] = [];
  cartItems: CartItem[] = [];

  displayedColumns: string[] = ['name', 'price', 'quantity', 'subtotal', 'actions'];

  form = this.fb.group({
    customerId: [null as number | null, Validators.required]
  });

  orders: Order[] = [];

  ngOnInit() {
    this.loadCustomers();
    this.loadProducts();
    this.loadOrders();
  }

  loadCustomers() {
    this.customerService.getAll().subscribe({
      next: (res: Customer[]) => {
        this.customers = res.map(c => ({
          id: c.id ?? (c as any).Id,
          name: c.name ?? (c as any).Name,
          email: c.email ?? (c as any).Email,
          phone: c.phone ?? (c as any).Phone,
          address: c.address ?? (c as any).Address,
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'Failed to load customers');
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (res: Product[]) => {
        this.products = res.map(p => ({
          id: p.id ?? (p as any).Id,
          name: p.name ?? (p as any).Name,
          sku: p.sku ?? (p as any).SKU,
          category: p.category ?? (p as any).Category,
          price: p.price ?? (p as any).Price,
          stockQuantity: p.stockQuantity ?? (p as any).StockQuantity
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'Failed to load products');
        this.cdr.detectChanges();
      }
    });
  }

  loadOrders() {
    this.orderService.getAll().subscribe({
      next: (res: Order[]) => {
        this.orders = res.map(o => ({
          id: o.id ?? (o as any).Id,
          customerId: o.customerId ?? (o as any).CustomerId,
          orderDate: o.orderDate ?? (o as any).OrderDate,
          totalAmount: o.totalAmount ?? (o as any).TotalAmount,
          customerName: o.customerName ?? (o as any).CustomerName,
          customerEmail: o.customerEmail ?? (o as any).CustomerEmail
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'Failed to load orders');
      }
    });
  }


  addProduct(product: Product) {
    const existing = this.cartItems.find(i => i.productId === product.id);

    const stock = product.stockQuantity ?? 0;

    if (existing) {
      if (existing.quantity < stock) {
        existing.quantity += 1;
        existing.qtyControl.setValue(existing.quantity);
      } else {
        this.alertService.error('Out of Stock', `${product.name} has no more stock`);
      }
    } else {
      if (stock <= 0) {
        this.alertService.error('Out of Stock', `${product.name} is not available`);
        return;
      }
      this.cartItems = [...this.cartItems, {
        orderId: 0,
        productId: product.id!,
        productName: product.name,
        quantity: 1,
        price: product.price,
        id: 0,
        qtyControl: new FormControl(1, { nonNullable: true })
      }];
    }
    this.cdr.detectChanges();
  }

  getStock(productId: number): number {
    const product = this.products.find(p => p.id === productId);
    return product?.stockQuantity ?? 0;
  }

  validateQty(item: CartItem) {
    const stock = this.getStock(item.productId);
    const qty = item.qtyControl.value;

    if (qty > stock) {
      this.alertService.error(
        'Maximum Quantity Reached',
        `You can only order ${stock} units of ${item.productName}`
      );
      item.qtyControl.setValue(stock);
      item.quantity = stock;
    } else if (qty < 1) {
      this.alertService.error(
        'Minimum Quantity',
        `You must order at least 1 unit of ${item.productName}`
      );
      item.qtyControl.setValue(1);
      item.quantity = 1;
    } else {
      item.quantity = qty;
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.cartItems = [...this.cartItems];
    this.cdr.detectChanges();
  }

  updateQty(item: OrderItem, qty: number) {
    if (qty <= 0) return;
    item.quantity = qty;
    this.cdr.detectChanges();
  }

  getTotal() {
    return this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }

  saveOrder() {
  if (this.form.invalid) {
    this.alertService.error('Missing Info', 'Please select a customer');
    return;
  }
  if (this.cartItems.length === 0) {
    this.alertService.error('Empty Cart', 'Add at least one product');
    return;
  }

  const order: Order = {
    customerId: Number(this.form.value.customerId),
    orderDate: new Date().toISOString(),
    totalAmount: this.getTotal()
  };

  this.orderService.create(order).subscribe({
    next: (created: any) => {
      const orderId = created?.id ?? created; // depends on backend response

      const itemRequests: Observable<void>[] = this.cartItems.map(item =>
        this.orderItemService.create({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })
      );

      forkJoin(itemRequests).subscribe({
        next: () => {
          this.alertService.success('Success', 'Order processed successfully');
          this.cartItems = [];
          this.form.reset();
          this.loadOrders();
          this.cdr.detectChanges();
        },
        error: () => {
          this.alertService.error('Error', 'Failed to save order items');
          this.cdr.detectChanges();
        }
      });
    },
    error: () => {
      this.alertService.error('Error', 'Failed to create order');
      this.cdr.detectChanges();
    }
  });
}


  deleteOrder(orderId: number) {
    if (!orderId) return;

    this.orderService.delete(orderId).subscribe({
      next: () => {
        this.alertService.success('Deleted', `Order #${orderId} removed`);
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertService.error('Error', 'Failed to delete order');
      }
    });
  }

  viewOrder(orderId: number) {
    forkJoin({
      order: this.orderService.getById(orderId),
      items: this.orderItemService.getByOrder(orderId)
    }).subscribe({
      next: ({ order, items }) => {
        this.dialog.open(this.orderDialog, {
          width: '800px',
          data: { order, items }
        });
      },
      error: () => {
        this.alertService.error('Error', 'Failed to load order details');
      }
    });
  }

  print(): void {
    window.print();
  }
}
