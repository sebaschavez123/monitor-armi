export interface TopLevel {
  about:       string;
  active:      boolean;
  cityConfigs: CityConfig[];
  objectID:    string;
}

export interface CityConfig {
  cityId:       string;
  active:       boolean;
  storeConfigs: StoreConfig[];
}

export interface StoreConfig {
  storeId:        number;
  active:         boolean;
  courierConfigs: CourierConfig[];
}

export interface CourierConfig {
  courierId?:     number;
  shippingOrder?: number;
  delay?:         number;
  active?:        boolean;
}
