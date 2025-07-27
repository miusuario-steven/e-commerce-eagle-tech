import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { HomeService } from '../../services/home.service';
import { Category } from '../../common/category';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../common/category-response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderUserComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productsLoading: boolean = true;

  constructor(
    private homeService: HomeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productsLoading = true;
    // Cargamos solo 4 productos destacados
    this.homeService.getProducts(0, 4).subscribe({
      next: (response) => {
        this.products = response.content;
        this.productsLoading = false;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.productsLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getPublicCategoryList().subscribe({
      next: (data: CategoryResponse) => {
        this.categories = data.content;
        console.log('Categorías cargadas:', this.categories);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }
}

