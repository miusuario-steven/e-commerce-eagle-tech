import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../common/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SessionStorageService } from '../../services/session-storage.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryResponse } from '../../common/category-response';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  selectedFile!: File;
  isEditMode: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  existingImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private sessionStorage: SessionStorageService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      urlImage: [''],
      userId: [null, Validators.required],
      categoryId: [null, Validators.required],
      version: [null] // Campo para el bloqueo optimista
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.loadProductData();
      this.setUserIdFromSession();
    }
  }

  loadCategories(): void {
    // Para el formulario de añadir/editar, generalmente se cargan todas las categorías sin paginación
    // Se asume que el número de categorías no será excesivamente grande para este caso de uso.
    this.categoryService.getCategoryList(0, 1000).subscribe({ // Se puede ajustar el tamaño si es necesario
      next: (data: CategoryResponse) => this.categories = data.content,
      error: (err) => this.notificationService.showError('Error', 'No se pudieron cargar las categorías.')
    });
  }

  loadProductData(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.productService.getProductById(id).subscribe({
          next: (data) => {
            this.productForm.patchValue(data);
            this.existingImageUrl = data.urlImage;
          },
          error: (err) => {
            this.notificationService.showError('Error', 'No se pudo cargar el producto.');
            this.router.navigate(['/admin/product']);
          }
        });
      }
    });
  }

  setUserIdFromSession(): void {
    const token = this.sessionStorage.getItem('token');
    if (token?.id) {
      this.productForm.get('userId')?.setValue(token.id);
    } else {
      this.notificationService.showInfo('Información', 'No se pudo obtener el ID de usuario.');
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.notificationService.showInfo('Formulario inválido', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    if (!this.selectedFile && !this.isEditMode) {
      this.notificationService.showInfo('Imagen requerida', 'Debes seleccionar una imagen para un nuevo producto.');
      return;
    }

    const formData = new FormData();
    const productData = this.productForm.value;
    const productJson = JSON.stringify(productData);
    formData.append('product', new Blob([productJson], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const saveOperation = this.isEditMode
      ? this.productService.updateProduct(productData.id, formData)
      : this.productService.createProduct(formData);

    saveOperation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Producto actualizado con éxito.' : 'Producto agregado con éxito.';
        this.notificationService.showSuccess('Éxito', message);
        this.router.navigate(['admin/product']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 413) {
          this.notificationService.showError('Archivo Demasiado Grande', 'La imagen supera el límite de 10MB permitido.');
        } else if (err.status === 409) { // 409 Conflict
          this.notificationService.showError('Conflicto de Edición', 'Este producto ha sido modificado por otro usuario. Por favor, recarga la página para ver los últimos cambios.');
        } else {
          this.notificationService.showError('Error', 'Hubo un problema al guardar el producto.');
        }
        console.error(err);
      }
    });
  }

  get f() { return this.productForm.controls; }
}