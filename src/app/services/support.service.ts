import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { countryConfig } from 'src/country-config/country-config';
import { firstValueFrom, map } from 'rxjs';
const apiKey = 'd968d6ef-2691-490a-ad83-21eed8903b56';
const idApiKey = 'ahZzfm9yYWNsZS1zZXJ2aWNlcy12emxhcmELEgdQcm9qZWN0IiQ2YWMxMGU3Yy1hZGJkLTQyZDQtOWRmNi1i' +
  'NWQ3YjhmNTQ1NDcMCxIGQXBpS2V5IiQ5YjgyNDJkZS03NGU0LTQzNWItYjA5Zi00MzVkYjlkYTA4MDAM';
const BASE_URL     = 'https://us-central1-stunning-base-164402.cloudfunctions.net/zendeskv3/v2';
const baseHeader = {headers: {
  'Content-Type': 'application/json',
  'Country': countryConfig?.headersNgZorro?.country,
}};
const IMG_URL_TOKEN = `https://images-dot-oracle-services-vzla.appspot.com/_ah/api/blobEndpoint/v1/blobattributes/${idApiKey}/${apiKey}`;

@Injectable({
  providedIn: 'root'
})
export class SupportService extends BaseService {

  urls = {
    tickets: `${BASE_URL}/tickets`,
    showTickes: `${BASE_URL}/tickets/:id`,
    addComments: `${BASE_URL}/tickets/:id/add-comments`,
    showComments: `${BASE_URL}/tickets/:id/comments`,
    orderTicketCreate: `${this.zendesk}/insertOrderTicketZendesk`,
    orderTicketShow: `${this.zendesk}/getOrderTicketZendeskByTicket/:id`,
    orderTicketlist: `${this.zendesk}/getOrderTicketZendeskByUser/:id`,
    getDetailTheoretical: `${this.gateway30Reports}/getOrderDetailTheoretical`,
  };
  headers = new HttpHeaders(countryConfig.headersNgZorro);

  keysSmsProperty = [
    'SMS_EXPRESS_CON_TRANSFERENCIAS',
    'SMS_EXPRESS_CON_KM_ALTO',
    'SMS_NATIONAL_CON_TRACKING',
    // 'SMS_ENVIALOYA_CON_TRACKING',
    'SMS_PROVEEDOR_CON_TRACKING'
  ];

  isPrime(order) {
    return order.isPrime=='TRUE';
  }

  constructor(public http:HttpClient) {
    super(http);
  }

  getTheorical(orderId: string) {
    return this.post(this.urls.getDetailTheoretical, {orderId})
      .pipe(map((m:any) => m.data));
  }

  doubleCobro(forma: any, order: any, incident: any): Promise<any> {
    const subject = `Dudas con el Cobro - ${forma.list.desc}`;
    const asistencia = forma.list.cat;
    const detalle = forma.list.uid;
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += this.commentHtmlInfo(forma.comment);
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
  }

  cuponPromo(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'No se aplicó promoción o cupón';
    const asistencia = incident.uid;
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += '<h2><strong>Información de la solicitud</strong></h2>';
    comment += this.htmlLine('Código del cupon', forma.cupon);
    comment += this.commentHtmlInfo(forma.comment);
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia});
  }

  dudaMensajero(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Incidente con el mensajero';
    const asistencia = 'incidente_con_el_mensajero';
    const detalle = '';
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    for (const wgt of incident.widgets) {
      if (wgt.wtype === 'messenger') { comment += this.messangerHtmlInfo(wgt.mensssager); }
      if (wgt.wtype === 'textblock') { comment += this.commentHtmlInfo(forma.comment); }
    }
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
  }

  malEstado(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Producto llegó en mal estado';
    let comment = `<h1>${subject}</h1>`;
    const asistencia = incident.uid;
    const detalle = '';
    comment += this.baseHtmlInfo(order);
    comment += this.productsHtmlInfo('Productos en mal estado', forma.products);
    comment += this.commentHtmlInfo(forma.comment);
    if (incident.file) {
      comment += this.htmlLine('Imagen Adjunta', '');
      return this.uploadImage(incident.file).then((results: any) => {
        comment += `<img src="${results.servingUrl}" />`;
        incident.image = results.servingUrl;
        return this.createTicket(subject, comment, {order, isPrime: this.isPrime, incident, asistencia, detalle});
      });
    }
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime, incident, asistencia, detalle});
  }

  pedidoIncompleto(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Mi pedido llegó incompleto';
    let comment = `<h1>${subject}</h1>`;
    const asistencia = incident.uid;
    const detalle = '';
    comment += this.baseHtmlInfo(order);
    comment += this.productsHtmlInfo('Productos faltantes', forma.products);
    comment += this.commentHtmlInfo(forma.comment);
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime, incident, asistencia, detalle});
  }

  otroProducto(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Llegó otro producto';
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += this.commentHtmlInfo(forma.comment);
    const asistencia = incident.uid;
    const detalle = '';
    if (incident.file) {
      comment += this.htmlLine('Imagen Adjunta', '');
      return this.uploadImage(incident.file).then((results: any) => {
        comment += `<img src="${results.servingUrl}" />`;
        incident.image = results.servingUrl;
        return this.createTicket(subject, comment, {order, isPrime: this.isPrime, incident, asistencia, detalle});
      });
    }
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime, incident, asistencia, detalle});
  }

  incidenteMensajero(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Incidente con el mensajero';
    const asistencia = forma.list[0].cat;
    const detalle = forma.list[0].uid;
    const messenger = { name: order.messenger, phone: order.messengerPhone};
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += this.listHtmlInfo('', forma.list);
    comment += this.messangerHtmlInfo(messenger);
    comment += this.commentHtmlInfo(forma.comment);
    incident.messenger = messenger;
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
    // return Promise.resolve(null)
  }

  noEntregado(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Pedido no entregado';
    let comment = `<h1>${subject}</h1>`;
    const asistencia = incident.uid;
    const detalle = '';
    const messenger = { name: order.messenger, phone: order.messengerPhone};
    comment += this.baseHtmlInfo(order);
    comment += this.messangerHtmlInfo(messenger);
    comment += this.commentHtmlInfo(forma.comment);
    incident.messenger = messenger;
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
  }

  entregaTarde(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Mi pedido se demoró en llegar';
    let comment = `<h1>${subject}</h1>`;
    const asistencia = incident.uid;
    const detalle = '';
    const messenger = { name: order.messenger, phone: order.messengerPhone};
    comment += this.baseHtmlInfo(order);
    comment += this.messangerHtmlInfo(messenger);
    comment += this.commentHtmlInfo(forma.comment);
    incident.messenger = messenger;
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
  }

  miFactura(forma: any, order: any, incident: any): Promise<any> {
    const subject = `Mi factura - ${forma.list.desc}`;
    const asistencia = incident.uid;
    const detalle = forma.list.uid;
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += this.commentHtmlInfo(forma.comment);
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident, asistencia, detalle});
  }
  
  otroProblema(forma: any, order: any, incident: any): Promise<any> {
    const subject = 'Otro Problema';
    let comment = `<h1>${subject}</h1>`;
    comment += this.baseHtmlInfo(order);
    comment += this.commentHtmlInfo(forma.comment);
    if (incident.file) {
      comment += this.htmlLine('Imagen Adjunta', '');
      return this.uploadImage(incident.file).then((results: any) => {
        comment += `<img src="${results.servingUrl}" />`;
        incident.image = results.servingUrl;
        return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident});
      });
    }
    return this.createTicket(subject, comment, {order, isPrime: this.isPrime(order), incident});
  }

    getTicket(tickectID: string) {
      const vurl = this.urls.showTickes.replace(':id', tickectID);
      return this.http.get(vurl, this.httpOptionsZendesk()).toPromise();
    }
    getTicketComments() {
      const vurl = this.urls.showTickes.replace(':id', '1855');
      return this.http.get(vurl, this.httpOptionsZendesk());
    }

    getComments(tickectID: string) {
      const vurl = this.urls.showComments.replace(':id', tickectID);
      return this.http.get(vurl, this.httpOptionsZendesk()).toPromise()
        .then((results: any) => results.comments);
    }

    getNanyTickets(tickets: string[]) {
      const serialized = tickets.join(',');
      const vurl = `${this.urls.tickets}/show_many?ids=${serialized}`;
      return this.http.get(vurl, this.httpOptionsZendesk()).toPromise();
    }

    // createComments(tickectID: string, vcomment: string) {
    //   const vurl = this.urls.addComments.replace(':id', tickectID);
    //   return this.http.post(vurl, {comment: vcomment, user: this.cuser}, this.httpOptionsZendesk())
    //     .toPromise()
    //     .then((results: any) => results.comments);
    // }

    createTicket(subject: string, comment: string, params: any) {
      const asistencia = params.asistencia || '';
      const detalle = params.detalle ? params.detalle : '';
      const data: any = {subject, comment, custom_fields: []};
      const order = params.order;
      const matrix = countryConfig.isColombia ? 1 : 0
      const deliveryType = order.orderDeliveryType || 'Express';
      data.ticket_form_id = countryConfig.isColombia ? 360001078271 : 360001066412;
      data.user = {firstName: order.customerName, lastName: '', email: order.customerEmail};
      // data.custom_fields.push({id: , value: this.cuser.email});
      data.custom_fields.push({id: 360033314052, value: order.customerPhone});
      data.custom_fields.push({id: 360033314012, value: order.customerDocument});
      data.custom_fields.push({id: 360034481171, value: matrix});
      data.custom_fields.push({id: 360033104771, value: order.orderId});
      data.custom_fields.push({id: 360034503372, value: detalle});
      data.custom_fields.push({id: 360031848351, value: asistencia});
      data.custom_fields.push({id: 360036212271, value: 'monitor'});
      data.custom_fields.push({id: 9343604039451, value: params.isPrime});
      data.custom_fields.push({id: 360036276472, value: deliveryType});
      data.custom_fields.push({id: 12594039699355, value: order.storeName});
      data.custom_fields.push({id: 12594095748123, value: order.paymentMethod});
      return firstValueFrom(
        this.http.post(`${this.urls.tickets}/create`, data, this.httpOptions())
      ).then((results: any) => {
        const ticket = results._ticket;
        const options = {
          ticket,
          incident: params.incident,
          image: params.image,
          userId: order.customerId,
        };
        return this.linkTicket(order.orderId, options, order.customerId);
      }).catch(() => Promise.reject(new Error(null)));
    }

    getNotifications(userId: string) {
      const vurl = this.urls.orderTicketlist.replace(':id', userId);
      return firstValueFrom(
        this.http.get(vurl, this.httpOptionsZendesk())
      ).then((results: any) => results.data.map((obj: any) => {
        const tmp = obj;
        tmp.incident = JSON.parse(obj.json);
        return tmp;
      }));
    }

    // listTickets(uid: any = null) {
    //   const id = uid || this.cuser.id;
    //   const vurl = this.urls.orderTicketlist.replace(':id', id);
    //   return this.http.get(vurl, this.httpOptionsZendesk()).toPromise().then((results: any) => results.data.map((obj: any) => {
    //     const tmp = obj;
    //     tmp.incident = JSON.parse(obj.json);
    //     return tmp;
    //   }));
    // }

    linkTicket(idOrder: string, params: any, userId: number) {
      const body = {
        statusId: 0,
        tmp: 'n/a',
        orderId: idOrder,
        ticketId: params.ticket.id,
        userId,
        image: params.image ? params.image : '',
        json: JSON.stringify(params.incident),
      };
      return firstValueFrom(this.http.post(this.urls.orderTicketCreate, body, { headers: this.headers}))
        .then(() => Promise.resolve(params.ticket));
    }

    linkTicketShow(ticket: string) {
      return firstValueFrom(this.http.get(this.urls.orderTicketShow.replace(':id', ticket), baseHeader))
        .then((results: any) => {
          const data: any = (results.data && results.data[0]) ? results.data[0] : null;
          data.incident = JSON.parse(data.json);
          return Promise.resolve(data);
        }
      );
    }

    uploadImage(tfile: File): Promise<any> {
      return this.http.get(IMG_URL_TOKEN).toPromise().then((results: any) => {
        const {blobURL} = results;
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          const request = new XMLHttpRequest();
          formData.append('apiKey', apiKey);
          formData.append('idApiKey', idApiKey);
          formData.append('photo', tfile, tfile.name);
          request.onreadystatechange = () => {
            if (request.readyState === 4) {
              if (request.status === 201 || request.status === 200) {
                resolve(JSON.parse(request.response));
              } else {
                reject(JSON.parse(request.response));
              }
            }
          };
          request.open('POST', blobURL, true);
          request.setRequestHeader("Country", countryConfig.headersNgZorro?.country) ;
          request.send(formData);
        });
      });
    }

    baseHtmlInfo(order: any) {
      let comment = this.htmlLine('Incidente generado via', 'Monitor');
      comment += this.htmlLine('Generado por', this.getLocalUser().employeeName+' ('+this.getLocalUser().rolName+')');
      comment += this.orderHtmlInfo(order);
      comment += this.userHtmlInfo(order);
      comment += this.productsHtmlInfo('Productos Ordenados', order.products.filter(product => !product.sending));
      const sendingProducts:Array<any> = order.products.filter(product => product.sending)
      if(sendingProducts.length > 0) comment += this.productsHtmlInfo('Productos Enviados', order.products.filter(product => product.sending));
      return comment;
    }
    private htmlLine(head: string, data: string) {
      return `<p><b>${head}: </b> ${data}</p>`;
    }
    orderHtmlInfo(order: any) {
      let text = '<h2><b>Información del pedido</b></h2>';
      text += this.htmlLine('Nº', order.orderId);
      text += this.htmlLine('Dirección', order.customerAddress);
      text += this.htmlLine('Tipo', order.orderDeliveryType);
      text += this.htmlLine('Estado', order.status);
      text += this.htmlLine('Tienda', order.storeName);
      text += this.htmlLine('Método de pago', order.paymentMethod);
      return text;
    }
    userHtmlInfo(order: any) {
      let text = '<h2><b>Información del cliente</b></h2>';
      text += this.htmlLine('Usuario', `${order.customerName}`);
      text += this.htmlLine('Email', `<a href="mailto:${order.customerEmail}">${order.customerEmail}</a>`);
      text += this.htmlLine('Identificación', order.customerDocument);
      text += '</br>';
      return text;
    }
    commentHtmlInfo(comment: string, title: string = 'Mensaje enviado por el cliente:') {
      return `
        <p><b>${title}</b></p>
        <p>${comment.replace(/\n/g, '<br />')}</p>
      `;
    }
    messangerHtmlInfo(messanger: any) {
      let text = '<h2><b>Información del Mensajero</b></h2>';
      text += this.htmlLine('Usuario', messanger.name);
      text += this.htmlLine('Telefono', `<a href="tel:${messanger.phone}">${messanger.phone}</a>`);
      text += '</br>';
      return text;
    }
    listHtmlInfo(title: string , list: any[]) {
      let text = this.htmlLine(title, '');
      text += '<ol>';
      for (const it of list) {
        text += `<li>${it.desc}</li>`;
      }
      text += '</ol>';
      return `${text}<br/>`;
    }
    productsHtmlInfo(title: string , list: any[]) {
      let text = this.htmlLine(title, '');
      text += '<table style="width:100%;table-layout:fixed;"><tbody>';
      for (const product of list) {
        text += `
          <tr style="border-bottom: 10px solid rgba(0,0,0,0.1);">
            <td width="60px" style="text-align:center">
              <img src="${product.image}" alt="" style="width: 50px;height: 50px;">
            </td>
            <td width="*%"><b>${product.itemName}<b></td>
            <td width="100px">${product.units}</td>
            <td width="100px">${product.price}</td>
          </tr>`;
      }
      text += '</tbody></table>';
      return `${text}<br/>`;
    }

    protected httpOptionsZendesk(sendToken: boolean = true): {headers: HttpHeaders} {
      const params: any = {};
      const token = 'Basic eW9hbmEuYW5nYXJpdGFAZmFybWF0b2RvLmNvbS90b2tlbjp6UWZ3Y3RmNmxNQW5sbFlBSWFhMUJMRzdOYnlhVUliSlk2cVppRHA5';
      params['Content-Type'] = 'application/json';
      if (sendToken) { params.Authorization = `${token}`; }
        return {headers: new HttpHeaders(params)};
    }


}
