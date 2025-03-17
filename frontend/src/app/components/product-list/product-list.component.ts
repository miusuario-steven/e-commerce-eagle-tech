import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HeaderAdminComponent,RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(): void {
    this.productService.getProduct().subscribe(
      data => {
        this.products = data;
        console.log(this.products);
      }
    );
  }

  deleteProductById(id: number) {

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
        this.productService.deleteProductById(id).subscribe(
          () => this.listProducts()
        );
        Swal.fire({
          title: "Productos",
          text: "Producto eliminado correctamente.",
          icon: "success"
        });
      }
    });
  }

  goToAddProductForm(): void {
    this.router.navigate(['/admin/product/addproduct']);
  }
}
