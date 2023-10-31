export const url = {
  urlBase:'https://gw-backend-corp.farmatodo.com/',
  urlNx1: 'https://nx1-retro---monitor-30-voqp7ipqwq-uc.a.run.app/'
}

export const environment = {
  production: false,
  hmr: true,
  gateway:            `${url.urlBase}_ah/api`,            // Backend 2.0
  gateway30:          `${url.urlBase}monitor/v3`,                  // Backend 3.0
  gateway30Antifraud: `${url.urlBase}antifraud/v3`, // Antifraude
  gateway30Dashboard: `${url.urlBase}monitor-dashboard/v3`,    // DASHBOARD
  gateway30Reports:   `${url.urlBase}monitor-reports/v3`,          // REPORTS
  gatewayFirebase:    'https://sturdy-spanner-212219.firebaseio.com/appMensajerosQA',            // PROD PROVISIONAL
  gateway30SAS:       `${url.urlBase}`,
  gatewaySB:          `${url.urlBase}_ah/api`,
  payments:           `${url.urlBase}payments/v2`,
  zendesk:            'https://multicountry-apigateway-dot-stunning-base-164402.uc.r.appspot.com/backend/flexible/v2/zendesk',
  support:            `${url.urlBase}delivery/v1`,
  uploadImages:       `${url.urlBase}`,
  searchCustomer:     `${url.urlBase}monitor/v3`,
  nx1Retro: `${url.urlNx1}monitor/v3`,
  firebaseConfig: {
    apiKey: "AIzaSyCUq3JkyEgJ2WJuTj-KQyaQXgY59d8z4MQ",
    authDomain: "stunning-base-164402.firebaseapp.com",
    databaseURL: 'https://stunning-base-scan-and-go.firebaseio.com',
    projectId: "stunning-base-164402",
    storageBucket: "stunning-base-164402.appspot.com",
    messagingSenderId: "211585366551",
    appId: "1:211585366551:web:ad4406f1ab31d3df413a52",
    measurementId: "G-2G8D42WFD"
  },
  // no modificar
  countryName: 'Colombia',
  indicator: 'COL',
  isColombia: true,
  isVenezuela: false,
  currency: 'COP',
  cctld: 'co',
  coordinates: [4.60971, -74.08175],
  version: 20230206,
  isBlockedById: 'customerMonitorEndpoint',
  endpoints: {
    courier: {
      useNewService: true
    }
  }
}
