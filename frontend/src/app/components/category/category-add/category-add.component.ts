import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { Category } from '../../../common/category';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderAdminComponent],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  pageTitle = 'Crear Categoría';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.categoryId = +id; // Convertir a número
        this.pageTitle = 'Editar Categoría';
        this.loadCategoryData(this.categoryId);
      }
    });
  }

  loadCategoryData(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.categoryForm.patchValue({ name: data.name });
      },
      error: (err) => {
        this.notificationService.showError('Error', 'No se pudo cargar la categoría para editar.');
        this.router.navigate(['/admin/category']);
      }
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.notificationService.showInfo('Formulario Inválido', 'Por favor, completa los campos requeridos.');
      return;
    }

    const categoryData: Category = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      // --- MODO EDICIÓN ---
      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Actualizada', 'La categoría ha sido actualizada correctamente.');
          this.router.navigate(['/admin/category']);
        },
        error: (err) => {
          this.notificationService.showError('Error', 'No se pudo actualizar la categoría.');
          console.error(err);
        }
      });
    } else {
      // --- MODO CREACIÓN ---
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Creada', 'La categoría ha sido creada correctamente.');
          this.router.navigate(['/admin/category']);
        },
        error: (err) => {
          this.notificationService.showError('Error', 'No se pudo crear la categoría.');
          console.error(err);
        }
      });
    }
  }

  // Helper para acceder a los controles del formulario en la plantilla
  get f() {
    return this.categoryForm.controls;
  }
}