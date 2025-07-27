import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../common/category';
import { NotificationService } from '../../../services/notification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { CategoryResponse } from '../../../common/category-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderAdminComponent, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoryList(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (data: CategoryResponse) => {
        this.categories = data.content;
        this.pageNumber = data.number;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        this.notificationService.showError('Error', 'No se pudieron cargar las categorías.');
        console.error(err);
      }
    });
  }

  deleteCategory(id: number): void {
    this.notificationService.confirmDelete('¿Estás seguro de eliminar esta categoría?')
      .then((result) => {
        if (result.isConfirmed) {
          this.categoryService.deleteCategoryById(id).subscribe({ 
            next: () => {
              this.notificationService.showSuccess('Eliminada', 'La categoría ha sido eliminada.');
              this.loadCategories(); // Recargar la lista
            },
            error: (err) => {
              this.notificationService.showError('Error', 'No se pudo eliminar la categoría.');
              console.error(err);
            }
          });
        }
      });
  }

  goToPage(page: number): void {
    this.pageNumber = page;
    this.loadCategories();
  }

  updatePageSize(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.pageNumber = 0; // Reset to first page when page size changes
    this.loadCategories();
  }

  doSearch(): void {
    this.pageNumber = 0; // Reset to first page on new search
    this.loadCategories();
  }
}