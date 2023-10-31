import { environment } from '../environments/environment';

let splitCountryname = environment.countryName.split('');

const configuration: any = {
  backend2: environment.gateway,
  backend3: environment.gateway30,
  antifraud: environment.gateway30Antifraud,
  dashboard: environment.gateway30Dashboard,
  reports: environment.gateway30Reports,
  firebase: environment.gatewayFirebase,
  sas: environment.gateway30SAS,
  sb: environment.gatewaySB,
  firebaseConfig: environment.firebaseConfig,
  countryName: environment.countryName,
  indicator: environment.indicator,
  isColombia: environment.isColombia,
  isVenezuela: environment.isVenezuela,
  currency: environment.currency,
  cctld: environment.cctld,
  phoneCode: environment.isColombia ? '57' : '58',
  coordinates: environment.coordinates,
  payments: environment.payments,
  zendesk: environment.zendesk,
  support: environment.support,
  uploadImages: environment.uploadImages,
  version: environment.version,
  searchCustomer: environment.searchCustomer,
  nx1Retro: environment.nx1Retro,
  headersNgZorro: {
    'country': (`${splitCountryname[0]}${splitCountryname[1]}${splitCountryname[2]}`).toString().toUpperCase()
  },
  isBlockedById: environment.isBlockedById,
  endpoints: environment.endpoints,
};

export { configuration as countryConfig };
