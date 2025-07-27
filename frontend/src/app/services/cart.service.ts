import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemCart } from '../common/item-cart';
import { SessionStorageService } from './session-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: Map<number, ItemCart> = new Map<number, ItemCart>();
  private cartItems$ = new BehaviorSubject<Map<number, ItemCart>>(this.items);
  private readonly cartKey = 'shoppingCart';

  // Observables públicos para que los componentes se suscriban
  public items$: Observable<ItemCart[]> = this.cartItems$.asObservable().pipe(
    map(itemsMap => Array.from(itemsMap.values()))
  );

  public total$: Observable<number> = this.cartItems$.asObservable().pipe(
    map(itemsMap => {
      let total = 0;
      itemsMap.forEach(item => total += item.getTotalPriceItem());
      return total;
    })
  );

  public quantity$: Observable<number> = this.cartItems$.asObservable().pipe(
    map(itemsMap => {
      let quantity = 0;
      itemsMap.forEach(item => quantity += item.quantity);
      return quantity;
    })
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sessionStorage: SessionStorageService
  ) {
    this.loadCart();
  }

  private updateCart(): void {
    this.saveCart();
    this.cartItems$.next(this.items);
  }

  private saveCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartArray = Array.from(this.items.entries());
      this.sessionStorage.setItem(this.cartKey, cartArray);
    }
  }

  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartArray = this.sessionStorage.getItem(this.cartKey);
      if (cartArray) {
        const plainItemsMap = new Map<number, any>(cartArray);
        this.items.clear();
        plainItemsMap.forEach((value, key) => {
          const item = new ItemCart(value.productId, value.productName, value.quantity, value.price);
          this.items.set(key, item);
        });
        this.cartItems$.next(this.items); // Notificar a los suscriptores después de cargar
      }
    }
  }

  addItemCart(itemCart: ItemCart): void {
    if (this.items.has(itemCart.productId)) {
      const existingItem = this.items.get(itemCart.productId)!;
      existingItem.quantity += itemCart.quantity;
    } else {
      this.items.set(itemCart.productId, itemCart);
    }
    this.updateCart();
  }

  deleteItemCart(productId: number): void {
    if (this.items.delete(productId)) {
      this.updateCart();
    }
  }

  clearCart(): void {
    this.items.clear();
    this.updateCart();
  }
}
