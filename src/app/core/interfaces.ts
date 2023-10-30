export interface Data {
    id: number
    name: string
    age: number
    address: string
    disabled: boolean
  }

  export interface ColumnData {
    name:string,
    header:string,
    label:string,
    key?:string,
    sortOrder?:any,
    filterMultiple?:boolean,
    listOfFilter?: Array<any>,
    // tslint:disable-next-line: ban-types
    sortFn?: Function,
    // tslint:disable-next-line: ban-types
    filterFn?:Function
  }

  export interface InputUtil{
    value:string,
    inputType:string,
    inputPlaceholder:string,
  }

  export interface ActionsUtil{
    name:string,
    actionName:string,
    // tslint:disable-next-line: ban-types
    action:Function,
    value?:string,
    inputType?:string,
    inputPlaceholder?:string,
    multiInput?:Array<InputUtil>
  }

  export interface Param{
    name:string,
    title?:boolean,
    currentValue?:string,
    action?:Function,
    key?:string,
    value?:string,
    inputType?:string,
    hide?: boolean,
    inputPlaceholder?:string,
    optionsSelect?:Array<any>,
    optionSelected?:any,
    multiInput?:Array<InputUtil>,
    optionsValue?:Array<any>,
    valueSelected?: any,
    validation?:Function,
    messageError?:string
    change?:Function
  }

  export interface User{
    documentNumber?: number,
    employeeNumber:number,
    state?:string,
    municipality?:string,
    storeId:number,
    storeName:string,
    storeAddress:string,
    rolUser:string,
    sessionToken:string,
    message:string,
    employeeName:string,
    employeePhone:string,
    email:string,
    rolId?:number,
    courierId?:number,
    password?:string
    cityId?:string,
    cityName?:string,
    providerName?:string,
    vehicleName?:string,
    listStoresId?: any[],
    active?:number,
    courierCity?:string,
    canBlockCouriers?:number,
    canModifyClients?:number,
    secondLastName?: string,
    rif?: number,
    address?: string,
    bankAccount?: number,
    bankAccountType?: string,
    hasTicketBook?: number,
    urlRif?: string,
    urlDocument?: string,
    referredMessenger?: string,
    contributor?: number,
    gender?: string,
    birthDate?: string,
    blockDescription?: string,
    canChangeOrders?: number,
    urlPhoto?: string,
    isValidImage?: number,
    agentUnlock?: string
  }

  export interface Rol{
    id:number,
    name:string,
    description:string,
  }

  export interface Store{
    operationEndTime:string,
    address:string,
    city:string,
    nets:any
    latitude: number
    deliveryType:string,
    photo:string,
    scheduleMsn:string,
    operationStartTime:string,
    phone:string,
    name:string,
    id:number,
    storeId?:number,
    longitude:number,
    status:number,
    municipality?:string,
    deliveryCourier?:number,
    deliveryMethod?:string,
    active?:boolean,
    hasPicking?:string,
    photoUrl?:string,

  }
  export interface States{
    name:string,
  }
  export interface Municipalities{
    name:string,
    state:string,
  }

  export interface Address {
    nickname:      string;
    city:         string;
    address:       string;
    comments:      string;
    latitude:      number;
    longitude:     number;
    closerStoreId: number;
    deliveryType:  string;
    municipality:  string;
    active:        boolean;
    cityName:      string;
    idCustomer:    number;
    idAddress:     number;
    cityId?:       string;
    customerId?:   string;
    customerAddressId?: string;
}

  export interface Customer{
    lastname:string,
    country:string,
    gender:string,
    registeredBy:string,
    documentType:number,
    purchases: Array<any>,
    documentNumber:number,
    creationDate:string,
    atomId:number,
    firstname:string,
    phone:string,
    id:number,
    vip: boolean,
    blocked:boolean,
    email:string,
    addresses?:Array<Address>,
    lifemiles?:Array<any>,
    discount?:string,
    isPrime?:boolean,
    lstProductsSubs?:Array<any>
    primeSusbcriptionDomain?: Array<primeSusbcriptionInfo>,
  }
  export interface primeSusbcriptionInfo {
    finishDate?: string,
    renewSusbcription?: boolean,
    startDate?: string,
    orderNumber?: number,
    typeSusbcription?: string
  }
  export interface Courier{
    id: number,
    name: string,
    status: boolean,
    courierId?: number
  }

  export interface Provider {
    email: string,
    label: string,
    value: number,
  }

  export interface IncentivesKm {
    id: number,
    km: number,
    value: number
  }

  export interface Coupon{
    componentId:number,
    minAmount:number,
    discountAmount:number,
    offerId:number,
    coupon:string,
    beginDate:string,
    endDate:string,
  }

  export interface Ticket{
    id:number,
  }

  // tslint:disable-next-line: class-name
  export interface downloadItem {
    title:string,
    subtitle:string,
    // tslint:disable-next-line: ban-types
    onBeforeOpen:Function
  }

  export interface ControlValueAccessor {
    writeValue(obj: any) : void
    registerOnChange(fn: any) : void
    registerOnTouched(fn: any) : void
  }

  export interface MessengerProvider {
    providerEmail:  string;
    providerName:   string;
    createDate?:    Date;
    courierName?:   number;
    courierId?:      number;
    messengerProviderId?: number;
  }
