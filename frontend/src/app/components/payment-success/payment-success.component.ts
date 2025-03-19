import { Component, OnInit } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { OrderService } from '../../services/order.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { OrderState } from '../../common/order-state';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [HeaderUserComponent],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    private orderService:OrderService,
    private sessionStorage:SessionStorageService
  ) { }

  ngOnInit(): void {
    console.log(this.sessionStorage.getItem('order'));
    const order = this.sessionStorage.getItem('order');

    const formData = new FormData();

    formData.append('id', order.id); 
    formData.append('state', OrderState.CONFIRMED.toString());
    
    this.orderService.updateOrder(formData).subscribe(
      data => { 
        console.log(data)
        console.log ('LogoutComponent: '+ this.sessionStorage.getItem('token'))
        this.sessionStorage.removeItem('token');
        console.log ('LogoutComponent eliminado : '+ this.sessionStorage.getItem('token'))
      }   
    );
  }

}
