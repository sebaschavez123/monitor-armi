export interface HomeCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface StoreCoordinates {
  latitude: number;
  longitude: number;
  storeId?: number;
  storeName?: string;
  storeAddress?: string;
}
