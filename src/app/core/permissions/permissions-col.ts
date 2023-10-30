import { ProfileBase, Dashboards, Reports, Placeholders, Utils } from "../const"

export const permissionsCol = {
    ADMINISTRADOR: {
      search:{
        date:true,
        document:true,
        order:true,
        guide:true,
        agent:true,
        sas:true,
        messenger: true,
        customer_phone: true
      },
      dashboard: {
        edit:true,
        assign: true,
        reassign:true, 
        cancel: true, 
        repush: true,
        relaunch: true,
        manager: true,
        'block-user': true,
        finalize: true,
        cendis: false,
        'active-order': true,
        reschedule: true,
        zendesk: true,
        observations: true,
        token: true,
        customer_phone: true
      },
      armi:{},
      reports:{},
      customers: {},
      users: {},
      sag:{},
      incentives:{},
      antifraud:{},
      utils:{},
      params:{},
    },
    'OPERADOR': <ProfileBase> {
      search: {
        date: true,
        order: true,
        agent: true,
        document: true,
        messenger: true
      },
      dashboard: {
        assign: false,
        reassign: false,
        observations: true,
        customer_phone: false,
        allowed: [
          Dashboards.express
        ]
      },
      reports: {
        allowed: [
          Reports.delivery
        ]
      }
    },
    'PICKER': <ProfileBase> {
      search: {
        date: true,
        order: true,
        agent: true,
        document: true,
        messenger: true
      },
      dashboard: {
        assign: true,
        observations: true,
        customer_phone: false,
        "block-user": true,
        allowed: [
          Dashboards.express
        ]
      }
    },
    'PICKER RAPPICARGO': <ProfileBase> {
      search: {
        date: true,
        order: true,
        agent: true,
        document: true,
        messenger: true
      },
      dashboard: {
        assign: true,
        observations: true,
        token: true,
        customer_phone: true,
        allowed: [
          Dashboards.express
        ]
      }
    },
    AGENTE: <ProfileBase> {
      search:{date:true, document:true, order:true, guide:true, agent:true, sas:true, customer_phone: true },
      dashboard: {
        edit:false, observations: true, reassign:false, assign: true, cancel: false, repush: false, manager: false, 'block-user': false,
        finalize: false,cendis: false,'active-order': false, reschedule: true, zendesk: true, token: false,customer_phone: true
      },
      reports:{},
    },
    CENDIS: {
      search:{date:true, document:true, order:true, guide:true, agent:true, sas:true, customer_phone: true},
      dashboard: {edit:true, observations: true, reassign:true, cancel: true, repush: true, manager: true, 'block-user': true,
      finalize: true, cendis: true,'active-order': true, reschedule: false, zendesk: false, token: false,customer_phone: true}
    },
    RX: {
      dashboard: {rx: true}
    },
    SCANANDGO: {sag:{}},
    'ASESORES DE SAC': <ProfileBase> {
      search:{
        document:true,
        order:true,
      },
      dashboard: {
        edit:true, reassign:true, cancel: true, repush: true, manager: true, 
        'block-user': true,
        finalize: true,
        cendis: false,
        'active-order': true,
        reschedule: true,
        zendesk: true,
        observations: true,
        token: false,
        customer_phone: true,
        allowed: [
          Dashboards.express,
          Dashboards.flash,
          Dashboards.specials,
          Dashboards.programed,
          Dashboards.providres,
          Dashboards.billed,
          Dashboards.natSendNow
      ]
      },
      'customers/customerSearch': {},
    },
    'MONITOR': <ProfileBase> {
      search:{
        date:true,
        document:true,
        order:true,
      },
      dashboard: {
        assign: true,
        reassign: true,
        activeOrder: true,
        reschedule: true,
        relaunch:true,
        repush: true,
        cancel: true,
        finalize: true,
        zendesk: true,
        customer_phone: true,
        token: true,
        "block-user": true,
        observations: true,
        allowed: [
          Dashboards.express,
          Dashboards.specials,
          Dashboards.programed,
          Dashboards.canceled,
          Dashboards.issued,
        ]
      },
      users: {
        allowed: [ Placeholders.messengers ]
      },
      utils: {
        allowed: [ Utils.actions, Utils.massiveActions, Utils.storeHours]
      }
    },
    'ANTI-FRAUDE': <ProfileBase> {
      search:{
        date:true,
        document:true,
        order:true,
      },
      dashboard: {
        cancel:true,
        finalize: true,
        zendesk: true,
        'block-user': true,
        activeOrder:true,
        observations: true,
        customer_phone: true,
        allowed: [
          Dashboards.express,
          Dashboards.antifraud
        ]
      },
      'customers/customerSearch': {},
      antifraud:true
    },
    'AGENTE FLASH': <ProfileBase> {
      search:{},
      dashboard: {
        reassign: true,
        activeOrder: true,
        reschedule:true,
        repush:true,
        finalize:true,
        zendesk:true,
        cancel:true,
        observations: true,
        allowed: [Dashboards.flash]
      },
      reports: {
        allowed: [Reports.SMS]
      }

    },
    'LÍDERES MONITOR': <ProfileBase> {
      search:{
        date: true,
        order: true,
        agent: true,
        document: true,
        messenger: true
      },
      dashboard: {
        reassign: true,
        activeOrder: true,
        reschedule:true,
        repush:true,
        finalize:true,
        zendesk:true,
        cancel:true,
        observations: true,
        'block-user': true,
        allowed: [ 
          Dashboards.express,
          Dashboards.specials,
          Dashboards.programed,
          Dashboards.canceled,
          Dashboards.issued,
          Dashboards.messengers,
          Dashboards.antifraud
        ]
      },
      reports: {
        allowed: [ Reports.SMS, Reports.delivery, Reports.observations ]
      },
      users: {
        allowed: [ Placeholders.messengers ]
      },
      utils: {
        allowed: [  Utils.actions, Utils.optimalRoute, Utils.storeHours, Utils.massiveActions ]
      }
    },
    'AGENTE CHAT': <ProfileBase> {
      search:{ date: true, order: true, document: true},
    },
    'AGENTE CALL': <ProfileBase> {
      search:{ date: true, order: true, document: true},
    },
    'ASESOR CALL': <ProfileBase> {
      search:{ date: true, order: true, document: true},
    },
    'LIDER CALL': <ProfileBase> {
      search:{ date: true, order: true, document: true},
      dashboard: {
        reassign: true,
        activeOrder: true,
        reschedule:true,
        repush:true,
        finalize:true,
        zendesk:true,
        cancel:true,
        observations: true,
        'block-user': true,
        allowed: [ 
          Dashboards.express,
          Dashboards.specials,
          Dashboards.programed,
          Dashboards.canceled,
          Dashboards.issued,
          Dashboards.messengers,
          Dashboards.antifraud
        ]
      },
      /*reports: {
        allowed: [ Reports. ]
      },*/
      customers: {},
      users: {
        allowed: [ Placeholders.users ]
      },
      utils: {
        allowed: [ Utils.actions ]
      }
    }

}


