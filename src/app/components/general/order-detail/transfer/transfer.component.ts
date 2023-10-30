import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, finalize } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TransferService } from 'src/app/services/transfer.service';
import { OrderProcessedList, ItemListTransfer, ProductTransfer, StoreTransfer, PartialStoreItemList } from './models/transfer';
import { HomeCoordinates, StoreCoordinates } from './transfer-map/models/transfer-map';
import { OrderService } from 'src/app/services/order.service';

interface LoadingService {
  getOrderProcessedList?: boolean;
  setTransferOrderFullStore?: boolean;
  setTransferOrderPartialStore?: boolean;
}

interface ItemListSelectStore {
  item?: number;
  store?: number;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnChanges, OnDestroy {

  @Input() orderId: number;
  @Input() showTransferModal: boolean = false;

  @Output() setShowTransferModal = new EventEmitter<boolean>();
  @Output() onUpdateOrder = new EventEmitter<boolean>();

  showSelectStoreModal: boolean = false;
  itemListSelectStore: ItemListSelectStore[] = [];
  updateMap: boolean = false;
  subscriptions: Subscription[] = [];
  orderProcessedList: OrderProcessedList;
  customerAddressCoordinates: HomeCoordinates;
  storesCoordinates: StoreCoordinates[];
  city: string;
  edit: boolean;
  stores: StoreTransfer[] = [];
  products: ProductTransfer[] = [];
  selectedProducts: ProductTransfer[] = [];
  shownStores: number[] = [];
  showMapResponsive: boolean = true;
  loading: LoadingService = {
    getOrderProcessedList: false,
    setTransferOrderFullStore: false,
  };

  unitsMapping: {[k: string]: string} = {
    '=1': '1 Und',
    'other': '# Unds',
  };
  missingMapping: {[k: string]: string} = {
    '=1': 'Falta 1',
    'other': 'Faltan #',
  };

  constructor(
    private _dS: DashboardService,
    private _tS: TransferService,
    private _oS: OrderService,
    private nzModal: NzModalService,
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.showTransferModal?.currentValue) {
      this.getOrderProcessedList();
    }
  }

  getOrderProcessedList(): void {
    if(!this.orderId) return;
    this.loading.getOrderProcessedList = true;
    const subscription = this._tS.getOrderProcessedList(this.orderId)
      .pipe(finalize(() => {
        this.loading.getOrderProcessedList = false;
        this.updateMap = true;
      }))
      .subscribe({
        next: res => {
          this.orderProcessedList = res;
          this.city = res?.data?.city;
          this.customerAddressCoordinates = {
            latitude: Number(res?.data?.customerDeliveryLatitude),
            longitude: Number(res?.data?.customerDeliveryLongitude),
            address: res?.data?.customerAddress,
          };
          this.setStores(res?.data?.itemList);
          this.setProducts(res?.data?.itemList);
        },
        error: err => this.showModalTransferError(),
      });
    this.subscriptions.push(subscription);
  }

  setTransferOrderFullStore(store: StoreTransfer): void {
    this.loading.setTransferOrderFullStore = true;
    const subscription = this._tS.setTransferOrderFullStore(store?.storeId, this.orderId)
      .pipe(finalize(() => this.loading.setTransferOrderFullStore = false))
      .subscribe({
        next: res => {
          this.showModalTransferSuccess();
          setTimeout(() => this.launch(this.orderId?.toString()), 1000);
        },
        error: err => this.showModalTransferError(),
      });
    this.subscriptions?.push(subscription);
  }

  setTransferOrderPartialStore(stores: StoreTransfer[]): void {
    this.loading.setTransferOrderPartialStore = true;
    const partialStoreItemList: PartialStoreItemList[] = [];
    stores?.forEach(store => {
      store?.products?.forEach(product => {
        partialStoreItemList?.push({
          storeId: store?.storeId,
          item: product?.item,
          stock: product?.stock,
        });
      });
    });
    const subscription = this._tS.setTransferOrderPartialStore(stores[0]?.storeId, this.orderId, partialStoreItemList)
      .pipe(finalize(() => this.loading.setTransferOrderPartialStore = false))
      .subscribe({
        next: res => {
          this.showModalTransferSuccess();
          setTimeout(() => this.launch(this.orderId?.toString()), 1000);
        },
        error: err => this.showModalTransferError(),
      });
    this.subscriptions?.push(subscription);
  }

  setProducts(itemList: ItemListTransfer[]): void {
    this.products = [];
    itemList?.forEach(product => {
      const index: number = this.products?.findIndex(item => item?.item === product?.item);
      if(index >= 0) {
        this.products[index].stock += product?.stock;
        return;
      }
      this.products.push({ ...product });
    });
  }

  changeSelectedProducts(product: ProductTransfer): void {
    if(this.getProductMissing(product) === 0) {
      this.nzModal.info({
        nzTitle: 'Producto con stock suficiente',
        nzContent: '<p>El producto que seleccionaste tiene el stock suficiente para completar la orden</p>',
      });
      return;
    }
    if(this.isSelectedProduct(product)) {
      this.selectedProducts = this.selectedProducts.filter(item => item?.item !== product?.item);
    } else {
      this.selectedProducts.push(product);
    }
  }

  changeQuantityProduct(selectedProduct: ProductTransfer, selectedStore: StoreTransfer, type: 'ADD' | 'DECREASE'): void {
    let newStores: Array<StoreTransfer> = [];
    this.stores?.forEach(store => {
      let newProducts: Array<ProductTransfer> = [];
      store?.products?.forEach(product => {
        if(store?.storeId === selectedStore?.storeId
          && product?.item === selectedProduct?.item
        ) {
          if(type === 'ADD') {
            if(this.getProductMissing(selectedProduct) > 0) product.stock += 1;
          } else if(type === 'DECREASE') {
            product.stock -= 1;
          }
        }
        if(product?.stock) newProducts?.push(product);
      });
      store.products = [ ...newProducts ];
      if(newProducts?.length) newStores?.push(store);
    });
    this.stores = [ ... newStores ];
    if(this.storesCoordinates?.length !== this.stores?.length) this.setStoresCoordinates();
  }

  isSelectedProduct(product: ProductTransfer): boolean {
    return !!this.selectedProducts.find(productToFind => productToFind?.item === product?.item);
  }

  getProductMissing(product: ProductTransfer): number {
    let quantity: number = 0;
    this.stores.forEach(store => {
      store.products.forEach(productStore => {
        if(productStore?.item === product?.item) quantity += productStore?.stock;
      });
    });
    return this.products?.find(realProduct => realProduct?.item === product?.item)?.stock - quantity;
  }

  setStores(itemList: ItemListTransfer[]): void {
    this.stores = [];
    itemList?.forEach(item => {
      const newStore: StoreTransfer = {
        storeId: item?.storeId,
        storeName: item?.storeName,
        storeAddress: item?.storeAddress,
        storeLatitude: item?.storeLatitude,
        storeLongitude: item?.storeLongitude,
        products: [],
      };
      const newProduct: ProductTransfer = {
        item: item?.item,
        itemName: item?.itemName,
        itemImage: item?.itemImage,
        stock: item?.stock,
      };
      this.stores = this.stores.map(store => {
        if(store?.storeId === item?.storeId) {
          store.products = [ ...store?.products, newProduct ];
        }
        return store;
      });
      if(!this.stores?.find(store => store?.storeId === item?.storeId)) {
        newStore.products = [ newProduct ];
        this.stores?.push(newStore);
      }
    });
    this.setStoresCoordinates();
  }
  
  setStoresCoordinates(): void {
    this.storesCoordinates = this.stores.map(store => {
      return {
        latitude: Number(store?.storeLatitude),
        longitude: Number(store?.storeLongitude),
        storeId: store?.storeId,
        storeName: store?.storeName,
        storeAddress: store?.storeAddress,
      };
    });
  }

  showStore(id: number): void {
    if(!this.shownStores.includes(id)) {
      this.shownStores.push(id);
    } else {
      this.shownStores = this.shownStores.filter(storeId => storeId !== id);
    }
  }

  isStoreSelected(id: number): boolean {
    return this.shownStores.includes(id);
  }

  addStore(): void {
    if(this.missingProducts() === 0) {
      this.showModalMissingProducts();
      return;
    }
    if(this.selectedProducts?.length === 0) {
      this.nzModal.info({
        nzTitle: 'No es posible agregar tienda',
        nzContent: '<p>Debes seleccionar al menos un producto para continuar</p>',
      });
      return;
    }
    this.changeShowSelectStoreModal(true);
    this.selectedProducts = [];
  }
  
  editStore(event?: Event): void {
    event?.stopPropagation();
    this.changeShowSelectStoreModal(true, true);
    this.selectedProducts = [];
  }
  
  deleteStore(storeToDelete: StoreTransfer, event?: Event): void {
    event?.stopPropagation();
    this.stores = this.stores?.filter(store => store?.storeId !== storeToDelete?.storeId);
    this.setStoresCoordinates();
    this.shownStores = this.shownStores?.filter(store => store !== storeToDelete?.storeId);
  }

  changeShowSelectStoreModal(value: boolean, edit: boolean = false): void {
    this.edit = edit;
    const productsToItemList: ProductTransfer[] = 
      this.edit 
        ? this.products 
        : this.selectedProducts?.filter(product => product?.stock > 0);
    this.itemListSelectStore = productsToItemList?.map(product => {
      return {
        item: product?.item,
        stock: this.edit ? product?.stock : this.getProductMissing(product),
      };
    });
    this.showSelectStoreModal = value;
  }

  onAddStore(store: StoreTransfer): void {
    this.stores?.push(store);
    this.setStoresCoordinates();
  }

  onEditStore(store: StoreTransfer): void {
    this.stores = [ store ];
    this.setStoresCoordinates();
  }

  missingProducts(): number {
    let quantity: number = 0;
    this.products?.forEach(product => {
      const missingProduct: number = this.getProductMissing(product);
      if(missingProduct > 0) quantity += missingProduct;
    });
    return quantity;
  }

  showModalMissingProducts(): void {
    this.nzModal.info({
      nzTitle: 'No es posible agregar más tiendas',
      nzContent: `
        <p>Todos los productos ya cuentan con una tienda asignada.</p>
        <p>Puedes editar o eliminar tiendas para modificar la orden.</p>
      `,
    });
  }

  showModalErrorMissingProducts(): void {
    this.nzModal.info({
      nzTitle: 'No es posible crear la transferencia',
      nzContent: `
        <p>Hay productos sin el stock suficiente.</p>
        <p>Debes asignar todos los productos faltantes a una tienda para continuar.</p>
      `,
    });
  }

  showModalTransferError(): void {
    this.nzModal.error({
      nzTitle: 'No fue posible crear la transferencia',
      nzContent: 'Intentelo más tarde',
    });
  }
  
  showModalTransferSuccess(): void {
    this.nzModal.success({
      nzTitle: 'Transferencia creada exitosamente',
    });
  }
  
  showModalLaunchSuccess(): void {
    this.nzModal.success({
      nzTitle: 'Orden relanzada exitosamente',
    });
  }
  
  showModalLaunchError(errorMessage: string): void {
    this.nzModal.error({
      nzTitle: 'Error al relanzar orden',
      nzContent: errorMessage || 'Intentelo más tarde',
    });
  }

  launch(orderId: string, incentive: number = 0): void {
    this._oS.launch(Number(orderId), { incentiveAmount: incentive})
      .pipe(finalize(() => {
        this.onUpdateOrder.emit(true);
        this.closeModal();
      }))
      .subscribe({
        next: res => {
          this.showModalLaunchSuccess();
        },
        error: err => {
          this.showModalLaunchError(err?.error?.message || err?.message);
        },
      });
  }

  showHistory(): void {
    this._dS.observationEvent.emit({action:'open', params: {orderId: this.orderId}});
  }

  changeShowMapResponsive(): void {
    this.showMapResponsive = !this.showMapResponsive;
    this.updateMap = true;
  }

  createTransfer(): void {
    if(this.missingProducts() > 0) {
      this.showModalErrorMissingProducts();
      return;
    }
    if(this.stores?.length === 1) {
      this.setTransferOrderFullStore(this.stores[0]);
      return;
    }
    this.setTransferOrderPartialStore(this.stores);
  }

  closeModal(): void {
    this.shownStores = [];
    this.setShowTransferModal.emit(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription?.unsubscribe();
    });
  }
}
