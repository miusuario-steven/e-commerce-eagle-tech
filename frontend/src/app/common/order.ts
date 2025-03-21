import { OrderProduct } from "./order-product";
import { OrderState } from "./order-state";

export class Order {
    constructor(
        public id:number|null,
        public dateCreated:Date,
        public orderProduct:OrderProduct [],
        public userId:number,
        public orderState:OrderState,
    ){}

    getTotal(){
        let total =0;
        for(const orderProduct of this.orderProduct){
            total += orderProduct.price * orderProduct.quantity;
            console.log('Total: '+total);
        }
    }
}
