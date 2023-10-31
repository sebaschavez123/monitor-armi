// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  gateway:            'https://monitor-dot-stunning-base-164402.appspot.com/_ah/api',            // Backend 2.0
  gateway30Antifraud: 'https://antifraud-dot-stunning-base-164402.uc.r.appspot.com/backend/flexible/v2/antifraud',
  gateway30:          'https://monitor30-dot-stunning-base-164402.appspot.com/backend/flexible/v2/monitor',                  // Backend 3.0
  gateway30Dashboard: 'https://mdp-10-dot-monitor30-dashboard-dot-stunning-base-164402.uc.r.appspot.com/backend/flexible/v2/monitor',    // DASHBOARD
  gateway30Reports:   'https://monitor30-reports-dot-stunning-base-164402.appspot.com/backend/flexible/v2/monitor',          // REPORTS
  gatewayFirebase:    'https://sturdy-spanner-212219.firebaseio.com/appMensajerosQA',            // PROD PROVISIONAL
  gateway30SAS:       'https://sas-v30-dot-stunning-base-164402.appspot.com',
  gatewaySB:          'https://stunning-base-164402.appspot.com/_ah/api',
  payments:           'https://payments-dot-stunning-base-164402.uc.r.appspot.com/backend/flexible/v1/payments',
  zendesk:            'https://zendesk-dot-oracle-services-vzla.uc.r.appspot.com/backend/flexible/v2/zendesk',
  support:            'https://v4-dot-support-services-dot-stunning-base-164402.uc.r.appspot.com/delivery/v1',
  uploadImages:       'https://upload-images-dot-stunning-base-164402.appspot.com',
  searchCustomer:     'https://multicountry-apigateway-dot-stunning-base-164402.uc.r.appspot.com/backend/flexible/v2/monitor',
  nx1Retro: 'https://nx1-retro---monitor-30-voqp7ipqwq-uc.a.run.app/monitor/v3',
  firebaseConfig: {
    apiKey: 'AIzaSyB1oqUaP_v6AS8kJu1FQZ7K16oOpf45gJg',
    authDomain: 'stunning-base-164402.firebaseapp.com',
    databaseURL: 'https://stunning-base-scan-and-go.firebaseio.com',
    projectId: 'stunning-base-164402',
    storageBucket: 'stunning-base-164402.appspot.com',
    messagingSenderId: '211585366551',
    appId: '1:211585366551:web:e51060a8950b29ce',
    measurementId: 'G-VBPCV9402P'
  },
  countryName: '',
  indicator: '',
  isColombia: undefined,
  isVenezuela: undefined,
  version: undefined,
  currency: '',
  cctld: '',
  coordinates: [],
  isBlockedById: '',
  endpoints: {
    courier: {
      useNewService: true
    }
  }
};
