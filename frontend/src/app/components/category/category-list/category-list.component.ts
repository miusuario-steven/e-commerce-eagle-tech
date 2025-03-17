import { Component, OnInit } from '@angular/core';
import { Category } from '../../../common/category';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent,RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
   
  categories: Category [] = [];

  constructor(private categoryService:CategoryService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.listCategories();
  }

  listCategories(){
    this.categoryService.getCategoryList().subscribe(
      data => this.categories = data
    );
  }
  deleteCategoryById(id:number){
    console.log('id de la categoria antes de eliminar:'+id);

    Swal.fire({
      title: "Quieres eliminar el producto?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "si, Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategoryById(id).subscribe(
          ()=>this.listCategories()
        );
        Swal.fire({
          title: "Categorias",
          text: "Categoria eliminada correctamente.",
          icon: "success"
        });
      }
    });
  }
}


