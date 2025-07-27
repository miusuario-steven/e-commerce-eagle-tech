import { OrderState } from "./order-state";
import { Customer } from "./customer";

export interface OrderSummary {
    id: number;
    dateCreated: Date;
    orderState: OrderState;
    total: number;
    customer: Customer;
}
