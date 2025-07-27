import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../common/category';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SearchCriteria } from '../../services/shop.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-filters.component.html',
})
export class ProductFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() categories: Category[] = [];
  @Input() initialCriteria: SearchCriteria | null = null;
  @Output() filtersChanged = new EventEmitter<{ categoryId?: number | null; minPrice?: number; maxPrice?: number }>();

  filterForm: FormGroup;
  selectedCategoryId: number | null = null;
  private destroy$ = new Subject<void>();
  private isInternalChange = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      minPrice: [null],
      maxPrice: [null]
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      if (!this.isInternalChange) {
        this.emitFilters();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCriteria'] && this.initialCriteria) {
      this.isInternalChange = true;
      this.selectedCategoryId = this.initialCriteria.categoryId || null;
      this.filterForm.patchValue({
        minPrice: this.initialCriteria.minPrice || null,
        maxPrice: this.initialCriteria.maxPrice || null,
      }, { emitEvent: false });
      // Pequeño timeout para asegurar que el cambio se procese antes de volver a escuchar
      setTimeout(() => this.isInternalChange = false, 100);
    }
  }

  selectCategory(categoryId: number | null, event?: MouseEvent): void {
    event?.preventDefault();
    this.selectedCategoryId = categoryId;
    this.emitFilters();
  }

  emitFilters(): void {
    const formValues = this.filterForm.getRawValue();
    this.filtersChanged.emit({
      categoryId: this.selectedCategoryId,
      minPrice: formValues.minPrice || undefined,
      maxPrice: formValues.maxPrice || undefined
    });
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.filterForm.reset({
      minPrice: null,
      maxPrice: null
    });
    // El reset ya dispara el valueChanges, por lo que emitFilters se llamará automáticamente
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
