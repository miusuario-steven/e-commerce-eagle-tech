import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,HeaderUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: Product [] = [];

  constructor(private homeService:HomeService){

  }

  ngOnInit(): void {
    this.homeService.getProduct().subscribe(
      data => { this.products = data;
        console.log(this.products); 
      },
    );
  }
}