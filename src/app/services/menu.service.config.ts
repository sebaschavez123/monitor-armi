// Colombia
export const getMenuColombia: any[] = [
  {
    title: 'Buscador de pedidos',
    key: 'search-orders',
    icon: 'fe fe-search',
    moduleName:'search',
    url: '/search/search-orders',
  },
  {
    title: 'Buscador proveedores',
    key: 'search-orders-providers',
    icon: 'fe fe-zoom-in',
    moduleName:'searchProviders',
    url: '/search/search-providers',
  },
  {
    title: 'Pedidos',
    key: 'pedidos',
    moduleName:'dashboard',
    icon: 'fe fe-shopping-cart',
    count: 14,
    children: [
      // {
      //   title: 'Express - Realtime',
      //   key: 'dashboardExpressRealtime',
      //   moduleName:'dashboard',
      //   url: '/dashboard/realtime-express',
      // },
      {
        title: 'Express',
        key: 'dashboardExpress',
        moduleName:'dashboard',
        url: '/dashboard/express',
      },
      {
        title: 'Calificaciones negativas',
        key: 'dashboardNegativeRating',
        moduleName:'dashboard',
        url: '/dashboard/negative-rating',
      },
      {
        title: 'Más de 10 minutos',
        key: 'dashboardGreaterTen',
        moduleName:'dashboard',
        url: '/dashboard/greater-ten',
      },
      {
        title: 'Flash',
        key: 'dashboardflash',
        moduleName:'dashboard',
        url: '/dashboard/flash-orders',
      },
      {
        title: 'Devolución exitosa',
        key: 'dashboardReturnSuccess',
        moduleName:'dashboard',
        url: '/dashboard/return-success',
      },
      {
        title: 'Especiales',
        key: 'dashboardSpecials',
        moduleName:'dashboard',
        url: '/dashboard/specials',
      },
      {
        title: 'Programados',
        key: 'dashboardProgramed',
        moduleName:'dashboard',
        url: '/dashboard/programmed',
      },
      {
        title: 'Proveedores',
        key: 'dashboardProvidres',
        moduleName:'dashboard',
        url: '/dashboard/provider',
      },
      /*{
        title: 'Gestionadas',
        key: 'dashboardManaged',
        moduleName:'dashboard',
        url: '/dashboard/managed',
      },*/
      {
        title: 'Facturados',
        key: 'dashboardBilled',
        moduleName:'dashboard',
        url: '/dashboard/billed',
      },
      /*{
        title: 'Nacionales y Envíalo Ya',
        key: 'dashboardNatSendNow',
        moduleName:'dashboard',
        url: '/dashboard/nat-send-now',
      },
      {
        title: 'Subscribete y ahorra',
        key: 'dashboardSubscription',
        moduleName:'dashboard',
        url: '/dashboard/subscription',
      },*/
      {
        title: 'Mensajeros y pedidos',
        key: 'dashboardMessengers',
        moduleName:'dashboard',
        url: '/dashboard/messengers',
      },
      {
        title: 'Cancelados',
        key: 'dashboardCanceled',
        moduleName:'dashboard',
        url: '/dashboard/canceled',
      },      {
        title: 'Call Center',
        key: 'dashboardCallcenter',
        moduleName:'dashboard',
        url: '/dashboard/callcenter',
      },
      /*{
        title: 'Incompletos',
        key: 'dashboardIncomplete',
        moduleName:'dashboard',
        url: '/dashboard/incomplete',
      },*/
      {
        title: 'Cambio método de pago',
        key: 'paymentmethodchange',
        moduleName:'dashboard',
        url: '/dashboard/payment-change',
      },
      {
        title: 'Emitidos',
        key: 'dashboardIssued',
        moduleName:'dashboard',
        url: '/dashboard/issued',
      },
      {
        title: 'Rx',
        key: 'dashboardRx',
        moduleName:'dashboard',
        url: '/dashboard/rx',
      },
      {
        title: 'Antifraude',
        key: 'dashboardAntifraud',
        moduleName:'dashboard',
        url: '/dashboard/antifraud',
      },
      {
        title: 'Canceladas Reembolso',
        key: 'dashboardPayu',
        moduleName:'dashboard',
        url: '/dashboard/payu-orders',
      },
      {
        title: 'Pedidos a reembolsar',
        key: 'dashboardRefund',
        moduleName:'dashboard',
        url: '/dashboard/refund',
      }
    ],
  },
  {
    title: 'Reportes',
    key: 'reports',
    moduleName:'reports',
    icon: 'fe fe-pie-chart',
    count: 3,
    children: [
      // {
      //   title: 'Asignados',
      //   key: 'reportAssign',
      //   moduleName:'reports',
      //   url: '/reports/assings',
      // },
      {
        title: 'Domicilios',
        key: 'reportsDelivery',
        moduleName:'reports',
        url: '/reports/delivery',
      },
      {
        title: 'Observaciones',
        key: 'reportsObservations',
        moduleName:'reports',
        url: '/reports/observations',
      },
      {
        title: 'Cancelados sin stock',
        key: 'reportsCanceledWithoutStock',
        moduleName:'reports',
        url: '/reports/canceled-without-stock',
      },
      {
        title: 'Estadísticas',
        key: 'reportsStatistics',
        moduleName:'reports',
        url: '/reports/statistics',
      },
      {
        title: 'Calificación de mensajeros',
        key: 'reportsMessengerRating',
        moduleName:'reports',
        url: '/reports/messenger-rating',
      },
      {
        title: 'Encolados',
        key: 'reportsGlued',
        moduleName:'reports',
        url: '/reports/glued',
      },
      {
        title: 'Detalle Cajero',
        key: 'reportsCashierDetail',
        moduleName:'reports',
        url: '/reports/cashier-detail',
      },
      {
        title: 'No Express',
        key: 'reportsNoExpress',
        moduleName:'reports',
        url: '/reports/no-express',
      },
      // {
      //   title: 'Domicilios.com',
      //   key: 'reportsPlatforms',
      //   moduleName:'reports',
      //   url: '/reports/platforms',
      // },
      {
        title: 'Pedidos cancelados',
        key: 'reportsCanceledOrders',
        moduleName:'reports',
        url: '/reports/orders-canceled',
      },
      {
        title: 'Envío de SMS',
        key: 'reportsSMS',
        moduleName:'reports',
        url: '/reports/sms',
      },
      {
        title: 'Incentivos',
        key: 'reportsIncentives',
        moduleName:'reports',
        url: '/reports/incentives',
      },
      {
        title: 'Gestión Agentes',
        key: 'reportsDataOrder',
        moduleName:'reports',
        url: '/reports/gestion-agentes',
      },
      {
        title: 'Devolución Exitosa',
        key: 'reportsDevolucionExitosa',
        moduleName:'reports',
        url: '/reports/return-success',
      }
    ]
  },
  {
    title: 'Clientes',
    key: 'customer',
    moduleName:'customers',
    icon: 'fe fe-users',
    count: 3,
    children: [
      {
        title: 'Búsqueda',
        key: 'customerSearch',
        moduleName:'customers',
        url: '/customer/search',
      },
      {
        title: 'Eliminados',
        key: 'customerRemoved',
        moduleName:'customers',
        url: '/customer/removed',
      },
      {
        title: 'Bloqueados',
        key: 'customerBlocked',
        moduleName:'customers',
        url: '/customer/blocked',
      },
    ],
  },
  {
    title: 'Usuarios',
    key: 'users',
    moduleName:'users',
    icon: 'fe fe-user-plus',
    count: 2,
    children: [
      {
        title: 'Mensajeros',
        key: 'userMessengers',
        moduleName:'users',
        url: '/user/messenger',
      },
      {
        title: 'Todos',
        key: 'userAll',
        moduleName:'users',
        url: '/user/list',
      },
    ]
  },
  {
    title: 'Incentivos',
    key: 'incentives',
    moduleName:'incentives',
    svg: 'incentive',
    count: 2,
    children: [
      {
        title: 'Incentivo',
        key: 'incentive',
        moduleName:'incentives',
        url: '/incentives',
      },
      {
        title: '2 X 1',
        key: 'incentive2x1',
        moduleName:'incentives',
        url: '/incentives/2x1-mu',
      },
      {
        title: 'N X 1 (ARMI)',
        key: 'incentive2x1FTD',
        moduleName:'incentives',
        url: '/incentives/nx1-armi',
      }
    ]
  },
  {
    title: 'Cupones',
    key: 'coupons',
    moduleName:'coupons',
    icon: 'fe fe-tag',
    url: '/coupons',
  },
  {
    title: 'Utilidades',
    key: 'utils',
    moduleName:'utils',
    icon: 'fa fa-cog',
    count: 5,
    children: [
      {
        title: 'Acciones',
        key: 'utilsActions',
        moduleName:'utils',
        url: '/utils/actions',
      },
      {
        title: 'Tiendas en ruta óptima',
        key: 'utilsOptimalRoute',
        moduleName:'utils',
        url: '/utils/optimal-route',
      },
      {
        title: 'Envío de tracking',
        key: 'utilsSendTracking',
        moduleName:'utils',
        url: '/utils/send-tracking',
      },
      {
        title: 'Asignación de couriers',
        key: 'utilsCoueriersAssign',
        moduleName:'utils',
        url: '/utils/courier-assignment',
      },
      /*{
        title: 'Inventario MarketPlace',
        key: 'utilsMarketPlace',
        moduleName:'utils',
        url: '/utils/market-place',
      },*/
      {
        title: 'Acciones masivas',
        key: 'utilsMassiveActions',
        moduleName:'utils',
        url: '/utils/massive-actions',
      },
      {
        title: 'Horario de tiendas',
        key: 'utilsStoreHours',
        moduleName:'utils',
        url: '/utils/store-hours',
      },
      {
        title: 'Stock',
        key: 'utilsStock',
        moduleName:'utils',
        url: '/utils/stock',
      },
      {
        title: 'Subastador',
        key: 'utilsAuctioneer',
        moduleName:'utils',
        url: '/utils/auctioneer',
      },
      {
        title: 'Proveedores de mensajeros',
        key: 'utilsProviders',
        moduleName:'utils',
        url: '/utils/messenger-providers',
      }
    ]
  },
  {
    title: 'Parametrizaciones',
    key: 'params',
    moduleName:'params',
    icon: 'fe fe-sliders',
    url: '/params',
  },
  {
    title: 'Scan&Go',
    key: 'scan-go',
    moduleName:'sag',
    icon: 'fa fa-barcode',
    url: '/scan-go',
  },
  {
    title: 'Antifraude',
    key: 'antifraud',
    moduleName:'antifraud',
    icon: 'fe fe-shield',
    url: '/antifraud',
  },
]

// VENEZUELA

export const getMenuVenezuela: any[] = [
  {
    title: 'Buscador de pedidos',
    key: 'search-orders',
    icon: 'fe fe-search',
    moduleName:'search',
    url: '/search/search-orders',
  },
  {
    title: 'Pedidos',
    key: 'pedidos',
    moduleName:'dashboard',
    icon: 'fe fe-shopping-cart',
    count: 13,
    children: [
      {
        title: 'Express',
        key: 'dashboardExpress',
        moduleName:'dashboard',
        url: '/dashboard/express',
      },
      {
        title: 'Programados',
        key: 'dashboardProgramed',
        moduleName:'dashboard',
        url: '/dashboard/programmed',
      },
      {
        title: 'Tiempos excedidos',
        key: 'dashboardTimeExcceded',
        moduleName:'dashboard',
        url: '/dashboard/time-exceeded',
      },
      {
        title: 'Pago Movil',
        key: 'dashboardPagoMovil',
        moduleName:'dashboard',
        url: '/dashboard/pago-movil',
      },
      {
        title: 'Posible demora',
        key: 'dashboardPesoVolumen',
        moduleName:'dashboard',
        url: '/dashboard/peso-volumen',
      },
      {
        title: 'Antifraude',
        key: 'dashboardAntifraud',
        moduleName:'dashboard',
        url: '/dashboard/antifraud',
      },
      {
        title: 'Canceladas Reembolso',
        key: 'dashboardPayu',
        moduleName:'dashboard',
        url: '/dashboard/payu-orders',
      },
      {
        title: 'Pedidos a reembolsar',
        key: 'dashboardRefund',
        moduleName:'dashboard',
        url: '/dashboard/refund',
      },
      {
        title: 'Cambio dirección',
        key: 'changeAddress',
        moduleName:'dashboard',
        url: '/dashboard/change-address',
      },
    ],
  },
  {
    title: 'Reportes',
    key: 'reports',
    moduleName:'reports',
    icon: 'fe fe-pie-chart',
    count: 3,
    children: [
      {
        title: 'Amplitude',
        key: 'reportsamplitude',
        moduleName:'reports',
        url: '/reports/amplitude',
      },
      {
        title: 'Finalización errada de pedidos',
        key: 'reportsOrdersCurrupted',
        moduleName:'reports',
        url: '/reports/orders-corrupted',
      },
      {
        title: 'Domicilios',
        key: 'reportsDelivery',
        moduleName:'reports',
        url: '/reports/delivery',
      },
      {
        title: 'Reembolsos exitosos',
        key: 'reportRefund',
        moduleName:'reports',
        url: '/reports/report-refund',
       
      },
      {
        title: 'Pedidos cancelados',
        key: 'reportsCanceledOrders',
        moduleName:'reports',
        url: '/reports/orders-canceled',
      }
    ]
  },
  {
    title: 'Clientes',
    key: 'customer',
    moduleName:'customers',
    icon: 'fe fe-users',
    count: 3,
    children: [
      {
        title: 'Búsqueda',
        key: 'customerSearch',
        moduleName:'customers',
        url: '/customer/search',
      },
    ],
  },
  {
    title: 'Usuarios',
    key: 'users',
    moduleName:'users',
    icon: 'fe fe-user-plus',
    count: 2,
    children: [
      {
        title: 'Mensajeros',
        key: 'userMessengers',
        moduleName:'users',
        url: '/user/messenger',
      },
      {
        title: 'Todos',
        key: 'userAll',
        moduleName:'users',
        url: '/user/list',
      },
    ]
  },
  {
    title: 'Incentivos',
    key: 'incentiveDashboard',
    moduleName:'incentives',
    svg: 'incentive',
    count: 2,
    children: [
      {
        title: 'Incentivo',
        key: 'incentive',
        moduleName:'incentives',
        url: '/incentives',
      },
      // {
      //   title: '2 X 1',
      //   key: 'incentive2x1',
      //   moduleName:'incentives',
      //   url: '/incentives/2x1',
      // },
    ]
  },
  {
    title: 'Scan&Go',
    key: 'scan-go',
    moduleName:'sag',
    icon: 'fa fa-barcode',
    url: '/scan-go',
  },
  {
    title: 'Utilidades',
    key: 'utils',
    moduleName:'utils',
    icon: 'fa fa-cog',
    count: 5,
    children: [
      {
        title: 'Acciones',
        key: 'utilsActions',
        moduleName:'utils',
        url: '/utils/actions',
      },
      {
        title: 'Asignación de couriers',
        key: 'utilsCoueriersAssign',
        moduleName:'utils',
        url: '/utils/courier-assignment',
      },
      {
        title: 'Acciones masivas',
        key: 'utilsMassiveActions',
        moduleName:'utils',
        url: '/utils/massive-actions',
      },
      // {
      //   title: 'Inventario',
      //   key: 'utilsMarketPlace',
      //   moduleName:'utils',
      //   url: '/utils/market-place',
      // }
    ]
  },
  {
    title: 'Parametrizaciones',
    key: 'params',
    moduleName:'params',
    icon: 'fe fe-sliders',
    url: '/params',
  },
  {
    title: 'Antifraude',
    key: 'antifraud',
    moduleName:'antifraud',
    icon: 'fe fe-shield',
    url: '/antifraud',
  },
]

// Armirene
export const getMenuArmirene = [
  {
    title: 'Armirene',
    key: 'Armi',
    moduleName:'armi',
    icon: 'fe fe-smartphone',
    children: [
      {
        title: 'Ganancias mensajero',
        key: 'messenger-profits',
        moduleName:'armi',
        url: '/armirene/messenger-profits',
      },
    ]
  },
];