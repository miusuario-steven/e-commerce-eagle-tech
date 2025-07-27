import { OrderProduct } from "./order-product";
import { OrderState } from "./order-state";
import { User } from "./user";

export class Order {
    id: number | null;
    dateCreated: Date;
    orderProducts: OrderProduct[];
    user: User; // Reemplazado userId por el objeto User completo
    orderState: OrderState;
    total: number;

    constructor(
        id: number | null,
        dateCreated: Date,
        orderProducts: OrderProduct[],
        user: User,
        orderState: OrderState,
        total: number
    ) {
        this.id = id;
        this.dateCreated = dateCreated;
        this.orderProducts = orderProducts;
        this.user = user;
        this.orderState = orderState;
        this.total = total;
    }
}
