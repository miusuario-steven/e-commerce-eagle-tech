import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../../header-user/header-user.component';
import { RouterModule } from '@angular/router';
import { ItemCart } from '../../../common/item-cart';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { OrderProduct} from '../../../common/order-product';
import { Order } from '../../../common/order';
import { OrderState } from '../../../common/order-state';
import { OrderService } from '../../../services/order.service';
import { PaymentService } from '../../../services/payment.service';
import { DataPayment } from '../../../common/data-payment';
import { error } from 'console';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-sumary-order',
  standalone: true,
  imports: [HeaderUserComponent,RouterModule,CommonModule],
  templateUrl: './sumary-order.component.html',
  styleUrl: './sumary-order.component.css'
})
export class SumaryOrderComponent implements OnInit {

  items : ItemCart [] = [];
  totalCart : number =0;
  firstName : string ='';
  lastName : string ='';
  email : string ='';
  address : string ='';
  orderProducts :OrderProduct [] = [];
  userId : number =1;

  constructor(private cartService:CartService,
    private userService:UserService,
    private orderService:OrderService,
    private paymentService:PaymentService,
    private sessionStorage:SessionStorageService
  ){}

  ngOnInit(): void {
    this.items = this.cartService.convertTolistFromMap();
    this.totalCart = this.cartService.totalCart();
    this.userId = this.sessionStorage.getItem('token').id;
    this.getUserById(this.userId);
    setTimeout (() => {
      this.sessionStorage.removeItem('token');
  }, 600000);
  } 
  
  generateOrder(){
    this.items.forEach(
      item=>{
        const orderProduct = new OrderProduct(null, item.productId, item.quantity, item.price);
        this.orderProducts.push(orderProduct);
      }
    );

    const order = new Order(null, new Date(),this.orderProducts, this.userId, OrderState.CANCELED);
    console.log('Order:'+ order.orderState);
    this.orderService.createOrder(order).subscribe(
      data=> {
        console.log('Orden creada con id: '+ data.id);
        this.sessionStorage.setItem('order', data);
      }
    );

    //redireccion y pago a paypal 
    let urlPayment;
    const dataPayment = new DataPayment ('PAYPAL', this.totalCart.toString(), 'USD', 'COMPRA');

    this.paymentService.getUrlPaypalPayment(dataPayment).subscribe(
      data => {
        urlPayment = data.url;
        console.log('Respuesta exitosa, URL recibida ', urlPayment);
        window.location.href = urlPayment;
      },
      error => {
        console.error('Error al obtener la URL de PayPal:', error)
      }
    );

  }
  
  
  deleteItemCart(productId:number){
    this.cartService.deleteItemCart(productId);
    this.items = this.cartService.convertTolistFromMap();
    this.totalCart = this.cartService.totalCart();
  }

  getUserById(id:number){
    this.userService.getUserById(id).subscribe(
      data => {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.address = data.address;
      }
    );
  }

}
