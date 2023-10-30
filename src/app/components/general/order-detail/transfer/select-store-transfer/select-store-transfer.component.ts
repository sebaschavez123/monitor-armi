import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { TransferService } from 'src/app/services/transfer.service';
import { DataTransferList, ProductTransfer, StoreTransfer, TransferList } from '../models/transfer';
import { NzModalService } from 'ng-zorro-antd/modal';

interface Item {
  item?: number;
  stock?: number;
}

interface LoadingService {
  getTransferList?: boolean;
}

type OrderBy = 'default' | 'storeName' | 'storeNameDesc' | 'distance' | 'distanceDesc' | 'porcentage' | 'porcentageDesc';

@Component({
  selector: 'app-select-store-transfer',
  templateUrl: './select-store-transfer.component.html',
  styleUrls: ['./select-store-transfer.component.scss']
})
export class SelectStoreTransferComponent implements OnChanges, OnDestroy {

  @Input() showModal: boolean = false;
  @Input() orderId: number;
  @Input() city: string;
  @Input() stores: StoreTransfer[] = [];
  @Input() edit: boolean = false;
  @Input() itemList: Item[] = [];

  @Output() onAddStore = new EventEmitter<StoreTransfer>();
  @Output() onEditStore = new EventEmitter<StoreTransfer>();
  @Output() changeShowModal = new EventEmitter<boolean>();

  subscriptions: Subscription[] = [];
  loading: LoadingService = {
    getTransferList: false,
  };
  transferList: TransferList;
  data: DataTransferList[];
  formattedStores: DataTransferList[];
  selectedStore: StoreTransfer;
  orderBy: OrderBy = 'distance';

  constructor(
    private _tS: TransferService,
    private nzModal: NzModalService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.showModal?.currentValue) {
      this.getTransferList();
    }
  }

  getTransferList(): void {
    this.loading.getTransferList = true;
    const subscription = this._tS.getTransferList(this.orderId, this.city, this.itemList)
      .pipe(finalize(() => this.loading.getTransferList = false))
      .subscribe({
        next: res => {
          this.transferList = res;
          this.data = res?.data;
          this.formatStores();
        },
        error: err => {
          this.nzModal.error({
            nzTitle: 'Error al obtener información de las tiendas cercanas',
            nzContent: err?.error?.message || err?.message || 'Intentelo más tarde',
          });
        },
      });
      this.subscriptions?.push(subscription);
  }

  changeOrderBy(orderBy: OrderBy): void {
    const infoOrderBy: {[k: string]: OrderBy} = {
      storeName: 'storeNameDesc',
      distance: 'distanceDesc',
      porcentage: 'porcentageDesc',
    };
    if(this.orderBy === orderBy && infoOrderBy[orderBy]) {
      this.orderBy = infoOrderBy[orderBy];
      this.formatStores();
      return;
    }
    if(Object.values(infoOrderBy)?.includes(this.orderBy) && this.orderBy === infoOrderBy[orderBy]) {
      this.orderBy = 'default';
      this.formatStores();
      return;
    }
    this.orderBy = orderBy;
    this.formatStores();
  }

  formatStores(): void {
    let newData: DataTransferList[] = this.data;
    newData = newData
      ?.filter(data => {
        if(!this.edit && this.stores.find(store => store?.storeId === data?.itemList[0]?.storeId)) {
          return false;
        }
        return true;
      })
      ?.map(data => {
        data.itemList = data?.itemList?.filter(product => product?.stock !== 0);
        return data;
      })
      ?.filter(data => data?.itemList?.length);
    if(this.orderBy !== 'default') {
      const formattedOrderBy = this.orderBy.replace('Desc', '');
      newData?.sort((a, b) => {
        if(this.orderBy?.includes('Desc')) {
          if(typeof a[formattedOrderBy] === 'string') {
            if(a[formattedOrderBy]?.toLowerCase() > b[formattedOrderBy]?.toLowerCase()) {
              return -1;
            }
            if(b[formattedOrderBy]?.toLowerCase() > a[formattedOrderBy]?.toLowerCase()) {
              return 1;
            }
            return 0;
          }
          return b[formattedOrderBy] - a[formattedOrderBy];
        } else {
          if(typeof a[formattedOrderBy] === 'string') {
            if(b[formattedOrderBy]?.toLowerCase() > a[formattedOrderBy]?.toLowerCase()) {
              return -1;
            }
            if(a[formattedOrderBy]?.toLowerCase() > b[formattedOrderBy]?.toLowerCase()) {
              return 1;
            }
            return 0;
          }
          return a[formattedOrderBy] - b[formattedOrderBy];
        }
      });
    }
    this.formattedStores = [ ...newData ];
  }

  selectStore(store: DataTransferList): void {
    if(this.isSelectedStore(store)) {
      this.selectedStore = null;
      return;
    }
    const products: ProductTransfer[] = store?.itemList?.map(({ storeId, ...rest }) => {
      return { distance: store?.distance, ...rest };
    });
    this.selectedStore = {
      storeId: store?.itemList[0]?.storeId,
      storeName: store?.storeName,
      storeAddress: store?.storeAddress,
      storeLatitude: store?.storeLatitude,
      storeLongitude: store?.storeLongitude,
      products: products,
    };
  }

  isSelectedStore(store: DataTransferList): boolean {
    return this.selectedStore?.storeId === store?.itemList[0].storeId;
  }

  onSelectStore(): void {
    if(!this.edit) {
      this.onAddStore.emit(this.filteredSelectedStore());
      this.closeModal();
      return;
    }
    this.onEditStore.emit(this.filteredSelectedStore());
    this.closeModal();
  }

  filteredSelectedStore():  StoreTransfer {
    const newSelectedStore: StoreTransfer = { ...this.selectedStore };
    newSelectedStore.products?.map(product => {
      const stockMissing: number = this.itemList?.find(item => item?.item === product?.item)?.stock;
      product.stock = stockMissing <= product?.stock ? stockMissing : product?.stock;
      return product;
    });
    return newSelectedStore;
  }

  closeModal(): void {
    this.changeShowModal.emit(false);
    this.cleanValues();
  }

  cleanValues(): void {
    this.transferList = null;
    this.data = null;
    this.selectedStore = null;
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(subscription => subscription?.unsubscribe())
  }
}
