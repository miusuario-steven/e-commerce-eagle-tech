export enum OrderState {
    PENDING = 'PENDING',
    PAYMENT_INITIATED = 'PAYMENT_INITIATED', // New state
    CANCELED = 'CANCELED',
    CONFIRMED = 'CONFIRMED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',    // New state
}
