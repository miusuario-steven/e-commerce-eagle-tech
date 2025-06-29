import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { HomeService } from '../../services/home.service';
import { Category } from '../../common/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    private homeService: HomeService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.homeService.getProduct().subscribe(data => {
      this.products = data;
      console.log('Productos cargados:', this.products);
    });
  }

  loadCategories(): void {
    this.categoryService.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categorías cargadas:', this.categories);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }
}
