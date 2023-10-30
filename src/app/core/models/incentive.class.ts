export interface Incentive {
    id?:                string;
    oid?:                string;
    cityId?:            string;
    storeId?:           string;
    courierId?:         string;
    cityName?:          string;
    storeName?:         string;
    courierName?:       string;
    value?:             any;
    active?:            boolean;
    title?:             string;
    description?:       string;
    incentiveStartDate?:number;
    incentiveEndDate?:  number;
    valueMin?:          number;
    valueMax?:          number;
    defaultIncentive?:  number;
    dates?:             Date[];
    list?:              any[];
    km?:              number;
}

export interface IncentiveBy {
    cityId?:            string;
    value:              number;
    incentiveStartDate: number;
    incentiveEndDate:   number;
    valueMin:           number;
    valueMax:           number;
    courierId?:         number;
    storeId?:           number;
}

export interface DefaultIncentive {
    active: boolean;
    defaultIncentive: number;
    description: string;
    incentiveEndDate: number;
    incentiveStartDate: number;
    title: string;
    value: number;
    valueMax: number;
    valueMin: number;
}

export const IncentiveTypes = [
    {
        label: 'Ciudad',
        pluralLabel: 'Ciudades',
        pluralLabelAll: 'Todas',
        value: 'incentiveByCity',
        service: 'cities',
        key: 'city',
        iddb: 'cityId',
        sortFn: (a: any, b: any) => String(a.city).localeCompare(String(b.city)),
        filterFn: (city: string, item: any) => item.city.indexOf(city) !== -1
    },
    {
        label: 'Tienda',
        pluralLabel: 'Tiendas',
        pluralLabelAll: 'Todas',
        value: 'incentiveByStore',
        service: 'stores',
        key: 'id',
        iddb: 'storeId',
        sortFn: (a: any, b: any) => String(a.storeName).localeCompare(String(b.storeName)),
        filterFn: (storeName: string, item: any) => item.storeName.indexOf(storeName) !== -1
    },
    {
        label:'Proveedor',
        pluralLabel: 'Proveedores',
        pluralLabelAll: 'Todos',
        value: 'incentiveByCourier',
        service: 'couriers',
        key: 'id',
        iddb: 'courierId',
        sortFn: (a: any, b: any) => String(a.courierName).localeCompare(String(b.courierName)),
        filterFn: (courierName: string, item: any) => item.courierName.indexOf(courierName) !== -1
    },
    {
        label:'Kilometros',
        pluralLabel: 'Kilometros',
        pluralLabelAll: 'Todos',
        value: 'incentiveByKm',
        service: 'incentiveByKm',
        key: 'id',
        iddb: 'km',
    },

]