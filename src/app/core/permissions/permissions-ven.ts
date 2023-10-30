//import { ProfileBase, Dashboards, Reports, Placeholders, Utils } from "../const"

export const permissionsVen = {
  ADMINISTRADOR: {
    search:{
      date:true,
      document:true, 
      order:true,
      guide:false,
      agent:false, sas:false, messenger: true, customer_phone: true},
    dashboard: {
      edit:true, observations: true, reassign:true, assign:true, cancel: true,
      repush: true, relaunch: true,
      manager: true, 'block-user': true,
      finalize: true,cendis: true,'active-order': true, reschedule: true,
      zendesk: true,
      token: true,
      customer_phone: true,
      incentives:{},
      exclude: [],
    },
    reports:{},
    'customers/customerSearch': {},
    users: {},
    sag:{},
    incentiveDashboard:{},
    utils:{},
    antifraud:{},
    params:{},
  },
  OPERADOR: {
    search:{date:true, document:true, order:true, guide:false, agent:false, sas:false, customer_phone: false},
    dashboard: {
      edit:false, observations: true, reassign:true, relaunch: true , cancel: true, repush: false, manager: false, 'block-user': false,
      finalize: true,cendis: false,'active-order': false, reschedule: true, zendesk: true, token: false,customer_phone:false
    },
    reports:{},
    utils:{},
  },
  PICKER: { 
    search:{
      date:true,
      document:true,
      order:true,
      guide:false,
      agent: true,
      sas:false,
      customer_phone: true
    },
    dashboard: {
      edit:false, reassign:false, cancel: false, repush: false, manager: false, 'block-user': false,
      finalize: false,cendis: false,'active-order': false, reschedule: false, zendesk: false, token: false,customer_phone: true
    }
  },
  PROVEEDOR: {
    search:{date:true, document:true, order:true, guide:false, agent:false, sas:false, customer_phone: true},
    dashboard: {
      edit:false, reassign:false, cancel: false, repush: false, manager: false, 'block-user': false,
      finalize: false,cendis: false,'active-order': false, reschedule: false, zendesk: false, token: false,customer_phone: true
    }
  },
  AGENTE: {
    search:{date:true, document:true, order:true, guide:false, agent:false, sas:false, customer_phone: true},
    dashboard: {
      edit:true, observations: true, reassign:false, cancel: false, repush: false, manager: false, 'block-user': false,
      finalize: false,cendis: false,'active-order': false, reschedule: true, zendesk: true, token: false,customer_phone: true
    },
  },
  SCANANDGO: {sag:{}},
}


