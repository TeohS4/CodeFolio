import { Component, OnInit } from '@angular/core';
import { PAGES_IMPORTS } from '../../pages.imports';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { Product } from '../../../core/interfaces/product.interface';
import { Order } from '../../../core/interfaces/order.interface';
import { Customer } from '../../../core/interfaces/customer.intertface';
import { OrderItem } from '../../../core/interfaces/order-item.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  products: any[] = [];
  orders: any[] = [];
  customers: any[] = [];
  orderItems: any[] = [];

  totalRevenue = 0;
  ordersChart: any;
  productsChart: any;
  stockChart: any;
  categoryChart: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Product[]>('https://localhost:7026/api/products').subscribe(res => {
      this.products = res;
      this.drawStockChart();
      this.drawCategoryChart();
    });

    this.http.get<Order[]>('https://localhost:7026/api/orders').subscribe(res => {
      this.orders = res;
      this.calculateRevenue();
      this.drawOrdersChart();
    });

    this.http.get<Customer[]>('https://localhost:7026/api/customers').subscribe(res => {
      this.customers = res;
    });

    this.http.get<OrderItem[]>('https://localhost:7026/api/orderitems').subscribe(res => {
      this.orderItems = res;
      this.drawTopProductsChart();
    });
  }

  calculateRevenue() {
    this.totalRevenue = this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  drawOrdersChart() {
    if (this.ordersChart) {
      this.ordersChart.destroy();
    }

    const map: any = {};

    this.orders.forEach(o => {
      const date = new Date(o.orderDate).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });

    this.ordersChart = new Chart('ordersChart', {
      type: 'line',
      data: {
        labels: Object.keys(map),
        datasets: [{
          label: 'Orders',
          data: Object.values(map)
        }]
      }
    });
  }

  drawTopProductsChart() {
    if (this.productsChart) {
      this.productsChart.destroy();
    }
    const map: Record<string, number> = {};

    this.orderItems.forEach(item => {
      const name = item.ProductName || `Product ${item.ProductId}`;

      map[name] = (map[name] || 0) + item.Quantity;
    });

    // Sort top 5
    const sorted = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sorted.length === 0) return;

    this.productsChart = new Chart('productsChart', {
      type: 'bar',
      data: {
        labels: sorted.map(x => x[0]),
        datasets: [
          {
            label: 'Top Selling Products',
            data: sorted.map(x => x[1])
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  drawStockChart() {
    if (this.stockChart) {
      this.stockChart.destroy();
    }

    const LOW_STOCK = 5;

    const sorted = [...this.products]
      .sort((a, b) => a.StockQuantity - b.StockQuantity)
      .slice(0, 10);

    this.stockChart = new Chart('stockChart', {
      type: 'bar',
      data: {
        labels: sorted.map(p => p.Name),
        datasets: [
          {
            label: 'Stock Quantity',
            data: sorted.map(p => p.StockQuantity),
            backgroundColor: sorted.map(p =>
              p.StockQuantity <= LOW_STOCK ? 'red' : 'green'
            )
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  drawCategoryChart() {
    if (!this.products || this.products.length === 0) return;

    const map: Record<string, number> = {};

    this.products.forEach(p => {
      const category = p.Category || 'Unknown';

      const value = (p.Price || 0) * (p.StockQuantity || 0);

      map[category] = (map[category] || 0) + value;
    });

    const labels = Object.keys(map);
    const data = Object.values(map);

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    this.categoryChart = new Chart('categoryChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Inventory Value (RM)',
            data: data
          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.raw || 0;
                return `RM ${value.toLocaleString()}`;
              }
            }
          }
        }
      }
    });
  }
}
