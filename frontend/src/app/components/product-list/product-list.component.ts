import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = true;

  // Paging properties
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.listProducts();
    }
  }

  listProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe(
      response => {
        this.products = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.notificationService.showError("Error", "No se pudieron cargar los productos.");
        console.error('Error fetching products:', error);
      }
    );
  }

  deleteProductById(id: number): void {
    this.notificationService.confirmDelete("¿Quieres eliminar el producto?", "").then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProductById(id).subscribe(
          () => {
            this.notificationService.showSuccess("Productos", "Producto eliminado correctamente.");
            // Vuelve a cargar la página actual, o la anterior si el elemento eliminado era el único en la página actual
            if (this.products.length === 1 && this.currentPage > 0) {
              this.currentPage--;
            }
            this.listProducts();
          },
          error => {
            this.notificationService.showError("Error", "No se pudo eliminar el producto.");
            console.error('Error deleting product:', error);
          }
        );
      }
    });
  }

  goToAddProductForm(): void {
    this.router.navigate(['/admin/product/addproduct']);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.listProducts();
  }

  // Helper to generate page numbers for pagination controls
  getPageNumbers(): number[] {
    if (this.totalPages > 0) {
      return Array(this.totalPages).fill(0).map((x, i) => i);
    }
    return [];
  }
}
