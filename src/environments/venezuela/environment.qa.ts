export const url = {
  urlBase:'https://multicountry-apigateway-dot-oracle-services-vzla.uc.r.appspot.com/',
  gateway30: 'https://mdp-15---monitor-30-iduiq3dhhq-uc.a.run.app/',
  gateway30Reports: 'https://search21---monitor-reports-iduiq3dhhq-uc.a.run.app/',
  gateway30Dashboard: 'https://mdp-15---monitor-dashboard-iduiq3dhhq-uc.a.run.app/',
  urlNx1: 'https://nx1-retro---monitor-30-voqp7ipqwq-uc.a.run.app/'
}

export const environment = {
  production: false,
  hmr: false,
  gateway:            `${url.urlBase}_ah/api`,// Backend 2.0
  gateway30:          `${url.gateway30}monitor/v3`, // Backend 3.0
  gateway30Antifraud: `${url.urlBase}antifraud/v3`, // Antifraude
  gateway30Dashboard: `${url.gateway30Dashboard}monitor-dashboard/v3`, // DASHBOARD
  gateway30Reports:   `${url.gateway30Reports}monitor-reports/v3`, // Reports
  gatewayFirebase:    'https://sturdy-spanner-212219.firebaseio.com/appMensajerosQA', // PROD PROVISIONAL
  gateway30SAS:       `${url.urlBase}`,
  gatewaySB:          `${url.urlBase}_ah/api`,
  payments:           `${url.urlBase}payments/v2`,
  zendesk:            `${url.urlBase}backend/flexible/v2/zendesk`,
  support:            `${url.urlBase}`, //no disponible para vzla
  uploadImages:       `${url.urlBase}`,
  searchCustomer:     `${url.urlBase}monitor/v3`,
  nx1: `${url.urlNx1}monitor/v3`,
  firebaseConfig: {
    apiKey: "AIzaSyCfrP99HvpCWenYVI3-7d3yxYz-OTwDS7w", 
    authDomain: "oracle-services-vzla.firebaseapp.com",
    databaseURL: 'https://oracle-services-vzla-scan-and-go.firebaseio.com/',
    projectId: "oracle-services-vzla",
    storageBucket: "oracle-services-vzla.appspot.com",
    messagingSenderId: "1071850495527",
    appId: "1:1071850495527:web:94c052306a96675a0f7802"
  },
  // no modificar
  countryName: 'Venezuela',
  indicator: 'VEN',
  isVenezuela: true,
  isColombia: false,
  currency: 'VEF',
  cctld: 've',
  coordinates: [10.4696, -66.8037],
  version: 20230426,
  isBlockedById: 'customerMonitorEndpoint',
  endpoints: {
    courier: {
      useNewService: false
    }
  }
}
