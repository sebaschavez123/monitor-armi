export const deliveryTypes = [
  {label: 'Nacional', value: 'Nacional'},
  {label: 'Envíalo ya', value: 'Envialo ya'},
]

export const colsProduct = [
  {label: 'Item', key: 'id', align: 'center' },
  {label: 'Imagen', key: 'image', align: 'center' },
  {label: 'Cod Barras', key: 'barcode', align: 'center' },
  {label: 'Desc', key: 'itemName', align: 'center' },
  {label: 'Tienda', key: 'storeName', align: 'center' },
  {label: 'Dirección', key: 'storeAddress', align: 'center' },
  {label: 'Unidades', key: 'units', align: 'center' },
  {label: 'Stock', key: 'stock', align: 'center' },
  {label: 'Sustitutos', key: 'sustitute', align: 'center' },
  // {label: 'Acciones', key: '', align: 'center' },
  {label: 'Precio unitario', key: 'price', align: 'center' },
]

  export const colsProductMissing = [
    {label: 'Item', key: 'id', align: 'center' },
    {label: 'Imagen', key: 'image', align: 'center' },
    {label: 'Cod Barras', key: 'barcode', align: 'center' },
    {label: 'Desc', key: 'itemName', align: 'center' },
    {label: 'Unidades', key: 'units', align: 'center' },
    // {label: 'Acciones', key: '', align: 'center' },
  ]

  export const typesSearchProduct = [
    {label: 'Código de barra', value: 'codigo', icon: 'fa fa-fw fa-barcode'},
    {label: 'Código de producto', value: 'idProducto', icon: 'fa fa-fw fa-code'},
  ];

  export const courierNac = [
    {label:'Liberty', value:'11'},
    {label:'Cargonam', value:'12'}
  ];

  export const couriersEnvialoYa = [
    {label:'Liberty', value:'11'},
    {label:'Cargonam', value:'12'}
  ];

  export const SupportOptions = [
    {
      ndx: 1,
      icon: '/assets/images/support/option-01.svg',
      name: 'Dudas con el cobro',
      desc: 'Aquí encuentras la factura de tu pedido, si tienes alguna duda escríbenos para poder ayudarte.',
      invoice: {src: '/assets/images/support/invoice.jpg'},
      widgets: [
        {
          wtype: 'list',
          title: 'Tipo de incidente',
          options: [
            {
              id: 1,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'dobles_cobros',
              desc: 'Doble Cobro'
            },
            {
              id: 2,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'cobrado_en_línea_y_no_entregado',
              desc: 'Cobrado en línea y no entregado',
            },
            {
              id: 3,
              cat: 'dudas_con_el_cobro_doble_cobro',
              uid: 'error_en_facturación',
              desc: 'Error de facturación'
            },
          ],
          checked: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
          comment: '',
        },
      ],
      asistencia: 360064947072,
      callback: 'doubleCobro',
    },
    {
      ndx: 2,
      icon: '/assets/images/support/option-02.svg',
      name: 'Incidente con el mensajero',
      desc: 'Nuestro personal ya está al tanto de lo sucedido.<br>A continuación te'
      + ' damos la información de tu caso para que le puedas hacer seguimiento.',
      widgets: [
        {
          wtype: 'list',
          options: [
            {
              id: 1,
              cat: 'incidente_con_el_mensajero',
              uid: 'otros',
              desc: 'Tiempo de entrega',
            },
            {
              id: 2,
              cat: 'incidente_con_el_mensajero',
              uid: 'mala_actitud',
              desc: 'Mala actitud',
            },
            {
              id: 3,
              cat: 'incidente_con_el_mensajero',
              uid: 'mala_presentación',
              desc: 'Mala presentación',
            },
            {
              id: 4,
              cat: 'incidente_con_el_mensajero',
              uid: 'cobró_antes_de_entregar',
              desc: 'Cobró antes de entregar',
            },
            {
              id: 5,
              cat: 'incidente_con_el_mensajero',
              uid: 'problemas_con_el_datáfono',
              desc: 'Problemas con el datáfono',
            },
            {
              id: 6,
              cat: 'incidente_con_el_mensajero',
              uid: 'método_de_pago',
              desc: 'Método de pago',
            },
            {
              id: 7,
              cat: 'incidente_con_el_mensajero',
              uid: 'otros',
              desc: 'Otro',
            },
          ],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      messenger: true,
      callback: 'incidenteMensajero',
    },
    {
      ndx: 3,
      icon: '/assets/images/support/option-03.svg',
      name: 'Producto llegó en mal estado',
      file: null,
      uid: 'producto_llegó_en_mal_estado',
      desc: 'Selecciona el producto que llegó en mal estado y escríbenos para poder ayudarte.',
      widgets: [
        {
          wtype: 'products-list',
          products: [],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
        {
          wtype: 'image-unload',
          title: 'Adjuntar imagen del producto:',
          source: '',
        },
      ],
      callback: 'malEstado',
    },
    {
      ndx: 4,
      icon: '/assets/images/support/option-04.svg',
      name: 'Mi pedido llegó incompleto',
      uid: 'mi_pedido_llegó_incompleto',
      desc: 'Selecciona el producto que no te llegó y escríbenos para poder ayudarte.',
      widgets: [
        {
          wtype: 'products-list',
          products: [],
          values: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      callback: 'pedidoIncompleto',
    },
    {
      ndx: 5,
      icon: '/assets/images/support/option-05.svg',
      name: 'Mi pedido no fue entregado',
      uid: 'mi_pedido_no_fue_entregado',
      widgets: [
        {
          wtype: 'messenger',
          mensssager: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      messenger: true,
      callback: 'noEntregado',
    },
    {
      ndx: 6,
      _id: 'cupon',
      icon: '/assets/images/support/option-06.svg',
      name: 'No se aplicó la promoción o el cupón',
      desc: 'Escribe el código del cupón o cuéntanos cuál fue la promoción que no se aplicó para poder ayudarte.',
      uid: 'no_se_aplico_promoción_o_cupón',
      widgets: [
        {
          wtype: 'textfield',
          name: 'cupon',
          value: '',
          title: 'Código del cupón:',
          placeholder: 'Escribe aquí el código',
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      callback: 'cuponPromo',
    },
    {
      ndx: 7,
      icon: '/assets/images/support/option-08.svg',
      name: 'Mi pedido se demoró en llegar',
      uid: 'mi_pedido_se_demoró_en_llegar',
      widgets: [
        {
          wtype: 'messenger',
          mensssager: null,
        },
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
      ],
      messenger: true,
      callback: 'entregaTarde',
    },
    {
      ndx: 8,
      icon: '/assets/images/support/option-09.svg',
      name: 'Llegó otro producto',
      uid: 'llegó_otro_producto',
      desc: 'Escríbenos o adjunta la imagen del producto que te llegó  y cuéntanos que quieres que hagamos para poder ayudarte.',
      widgets: [
        {
          wtype: 'textblock',
          title: 'Escríbenos tus comentarios:',
        },
        {
          wtype: 'image-unload',
          title: 'Adjuntar imagen del producto:',
          source: '',
        },
      ],
      callback: 'otroProducto',
    },
  ];

  export enum Reports {
    delivery = 'reportsDelivery',
    observations = 'reportsObservations',
    canceledWithouthStock = 'reportsCanceledWithoutStock',
    statistics = 'reportsStatistics',
    glued = 'reportsGlued',
    cashierDetail = 'reportsCashierDetail',
    noExpress = 'reportsNoExpress',
    canceledOrders = 'reportsCanceledOrders',
    SMS = 'reportsSMS',
  }

  export enum Dashboards {
    express = 'dashboardExpress',
    flash = 'dashboardflash',
    specials = 'dashboardSpecials',
    programed = 'dashboardProgramed',
    providres = 'dashboardProvidres',
    managed = 'dashboardManaged',
    billed = 'dashboardBilled',
    natSendNow = 'dashboardNatSendNow',
    subscription = 'dashboardSubscription',
    messengers = 'dashboardMessengers',
    canceled = 'dashboardCanceled',
    incomplete = 'dashboardIncomplete',
    payment = 'paymentmethodchange',
    issued = 'dashboardIssued',
    rx = 'dashboardRx',
    antifraud = 'dashboardAntifraud',
    payu = 'dashboardPayu',
    refund = 'dashboardRefund',
    greaterTen = 'dashboardGreaterTen',
  }

  export enum Placeholders {
    messengers = 'userMessengers',
    users = 'userAll'
  }

  export enum Utils {
    actions = 'utilsActions',
    optimalRoute = 'utilsOptimalRoute',
    sendTracking = 'utilsSendTracking',
    coueriersAssign = 'utilsCoueriersAssign',
    marketPlace = 'utilsMarketPlace',
    massiveActions = 'utilsMassiveActions',
    storeHours = 'utilsStoreHours',
  }

  export interface ProfileBase {
    search?:{
      date?: boolean,
      document?: boolean,
      order?: boolean,
      guide?: boolean,
      agent?: boolean,
      sas?: boolean,
      messenger?: boolean,
      customer_phone?: boolean
    }
    dashboard?: {
      edit?:boolean,
      'block-user'?: boolean,
      cendis?: boolean,
      'active-order'?: boolean,
      observations?: boolean,
      assign?: boolean,
      reassign?: boolean,
      relaunch?: boolean,
      cancel?: boolean,
      token?: boolean,
      repush?: boolean,
      manager?: boolean,
      reschedule?: boolean,
      zendesk?: boolean,
      blockUser?: boolean,
      finalize?: boolean,
      activeOrder?: boolean,
      customer_phone?: boolean,
      allowed?: Dashboards[]
    },
    reports?:{
      allowed?: Reports[]
    },
    customers?: {},
    users?: { allowed?: Placeholders[] },
    sag?:{},
    antifraud?:{},
    utils?:{ allowed?: Utils[] },
    params?:{},
  };