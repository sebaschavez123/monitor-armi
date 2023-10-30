export interface OrderProcessedList {
    code?: string;
    message?: string;
    data?: DataTransfer;
}

export interface DataTransfer {
    city?: string;
    customerDeliveryLatitude?: string;
    customerDeliveryLongitude?: string;
    customerAddress?: string;
    distance?: number;
    itemList?: ItemListTransfer[];
}

export interface ItemListTransfer extends ProductTransfer, StoreTransfer {
}

export interface ProductTransfer {
    stock?: number;
    distance?: number;
    item?: number;
    itemName?: string;
    itemImage?: string;
}

export interface StoreTransfer {
    storeId?: number;
    storeName?: string;
    storeAddress?: string;
    storeLatitude?: string;
    storeLongitude?: string;
    products?: ProductTransfer[];
}

// getTransferList
export interface TransferList {
    code?: string;
    message?: string;
    data?: DataTransferList[];
}

export interface DataTransferList {
    city?: string;
    distance?: number;
    itemList?: ItemListStores[];
    porcentage?: number;
    storeName?: string;
    storeAddress?: string;
    storeLatitude?: string;
    storeLongitude?: string;
}

export interface ItemListStores extends ProductTransfer {
    storeId?: number;
}

export interface PartialStoreItemList {
    storeId: number;
    item: number;
    stock: number;
}
