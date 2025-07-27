import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { HomeService } from '../../../services/home.service';
import { CartService } from '../../../services/cart.service';
import { ItemCart } from '../../../common/item-cart';
import { NotificationService } from '../../../services/notification.service'; // ✅ nuevo import

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [FormsModule, HeaderUserComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit {
  id: number = 0;
  name: string = '';
  description: string = '';
  price: number = 0;
  urlImage: string = '';
  quantity: number = 0;

  constructor(
    private homeService: HomeService,
    private activetedRoute: ActivatedRoute,
    private cartService: CartService,
    private notification: NotificationService // ✅ reemplaza AppComponent
  ) {}

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    this.activetedRoute.params.subscribe(p => {
      const id = p['id'];
      if (id) {
        this.homeService.getProductById(id).subscribe(data => {
          this.id = data.id;
          this.name = data.name;
          this.description = data.description;
          this.urlImage = data.urlImage;
          this.price = data.price;
        });
      }
    });
  }

addCart(id: number) {
  // ✅ Validación para límite de unidades
  if (this.quantity > 4) {
    this.notification.showInfo('Solo puedes añadir hasta 4 unidades por producto', 'warning');
    return;
  }

  const item = new ItemCart(id, this.name, this.quantity, this.price);
  this.cartService.addItemCart(item);

  this.notification.showSuccess('Producto añadido al carrito de compras', '');
}

}
