import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../common/category';
import { NotificationService } from '../../../services/notification.service'; // ✅ NUEVO

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [HeaderAdminComponent, FormsModule],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css'
})
export class CategoryAddComponent implements OnInit {
  id: number = 0;
  name: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notification: NotificationService // ✅ Sustituye a AppComponent
  ) {}

  ngOnInit(): void {
    this.getCategoryById();
  }

  addCategory() {
    const category = new Category(this.id, this.name);
    this.categoryService.createCategory(category).subscribe(() => {
      this.notification.show('Categoría registrada correctamente', 'success'); // ✅ NOTIFICACIÓN
      this.router.navigate(['admin/category']);
    });
  }

  getCategoryById() {
    this.activatedRoute.params.subscribe(category => {
      const id = category['id'];
      if (id) {
        this.categoryService.getCategotyById(id).subscribe(data => {
          this.id = data.id;
          this.name = data.name;
        });
      }
    });
  }
}
