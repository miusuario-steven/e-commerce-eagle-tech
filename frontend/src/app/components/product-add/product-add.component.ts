import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { Category } from '../../common/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [HeaderAdminComponent, FormsModule,CommonModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent  implements OnInit{
  
  id: number =0;
  code: string = '02';
  name: string = '';
  description : string = '';
  price: number = 0;
  urlImage: string = "";
  userId : string ='1';
  categoryId: string ='6';
  user : number = 0;

  selectFile! : File;

  categories : Category [] = [];

  constructor(
    private productService : ProductService,
    private router:Router, 
    private activatedRoute:ActivatedRoute,
    private toastr: ToastrService,
    private categoryService:CategoryService,
    private sessionStorage : SessionStorageService
  ){ }

  ngOnInit(): void {
    this.getProductById();
    this.getCategories();
    this.user = this.sessionStorage.getItem('token').id;
    this.userId = this.user.toString();
   }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.urlImage = input.files[0].name;
    }
  }

  addProduct(){
    const formData = new FormData();
    formData.append('id',this.id.toString());
    formData.append('code',this.code);
    formData.append('name',this.name);
    formData.append('description',this.description);
    formData.append('price',this.price.toString());
    formData.append('image',this.selectFile);
    formData.append('urlImage',this.urlImage);
    formData.append('userId', this.userId);
    formData.append('categoryId',this.categoryId);
    //console.log(formData.get('id'));
    console.log(formData);


    this.productService.createProduct(formData).subscribe(
      response => {
      console.log('Producto agregado con éxito', response);
      if(this.id==0){
        this.toastr.success('Producto agregado con éxito', 'Productos');
      }else{
        this.toastr.success('Producto actualizado con éxito', 'Productos');
      }
      this.router.navigate(['admin/product']);
    });
  }
    
  getProductById(){
    this.activatedRoute.params.subscribe(
      prod =>{
        const id = prod['id'];
        if(id){
          console.log('el valor de la variable id es : '+id);
          this.productService.getProductById(id).subscribe(
            data =>{
              this.id = data.id;
              this.code = data.code;
              this.name = data.name;
              this.description = data.description;
              this.urlImage = data.urlImage;
              this.price = data.price;
              this.userId = data.userId;
              this.categoryId = data.categoryId;
            }
          );
            
        }
      }
    );
  }

  onFileSelected(event : any){
    this.selectFile = event.target.files[0];
  }

  getCategories(){
    return this.categoryService.getCategoryList().subscribe(
      data => this.categories = data
    )
  }

}
