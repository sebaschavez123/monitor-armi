import { Component, OnInit } from '@angular/core';
import { ActionsUtil, InputUtil } from '../../../core/interfaces';
import { UtilsService } from '../../../services/utils.service';
import { OrderService } from '../../../services/order.service';
import { countryConfig } from 'src/country-config/country-config';
import { DashboardService } from 'src/app/services/dashboard.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-utils-actions',
  templateUrl: './utils-actions.component.html',
  styleUrls: ['./utils-actions.component.scss']
})
export class UtilsActionsComponent implements OnInit {

  acctionsMessengers:Array<ActionsUtil> = []
  acctionsRelease:Array<ActionsUtil> = []
  actionEdit:ActionsUtil;

  constructor(private _uS:UtilsService,
              private _oS:OrderService,
              private _dS: DashboardService) { }

  ngOnInit(): void {
    if (countryConfig.isColombia) this.getActionsColombia();
    else this.getActionsVenezuela();
  }

  verifyAction(data:ActionsUtil){
    if(data.multiInput){
      for (const input of data.multiInput) {
        if(!input.value || input.value === '') return true;
      }
      return false
    }else return !data.value || data.value === '';

  }

  private getActionsColombia(){
    this.acctionsMessengers = [
      {
        name: 'Liberar mensajero por número de Orden',
        actionName: 'Liberar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de orden',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.releaseOrderMessengerByOrderId(this.acctionsMessengers[index].value)
            ),
            'Liberando mensajero',
            'Mensajero liberado',
            'Error en servicio',
            (isCorrect, value) => {
              if(isCorrect) {
                this._uS.releaseInFirebase(this.acctionsMessengers[index].value);
                this._dS.actionToken(this.acctionsMessengers[index].value);
              }
            }
          );
        }
      },
      {
        name: 'Liberar mensajero por id de mensajero',
        actionName: 'Liberar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de mensajero',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.releaseOrderMessengerByMessengerId(this.acctionsMessengers[index].value)
            ),
            'Liberando mensajero',
            'Mensajero liberado',
            'Error en servicio',
            // (isCorrect, value) => {
            //   if(isCorrect) this._uS.releaseInFirebase(this.acctionsMessengers[index].value);
            // }
          );
        }
      },
      {
        name: 'Reimpulsar orden',
        actionName: 'Reimpulsar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de orden',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._oS.reassingManual(this.acctionsMessengers[index].value, 13)
            ),
            'reimpulsando orden',
            'Orden reimpulsada',
            'Error en servicio'
          );
        }
      },
      {
        name: 'Bloquear mensajero',
        actionName: 'Bloquear',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de mensajero',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.updateStatusMessenger(this.acctionsMessengers[index].value, '2')
            ),
            'Bloqueando mensajero',
            'Mensajero bloqueado',
            'Error en servicio'
          );
        }
      },
      {
        name: 'Desbloquear mensajero',
        actionName: 'Desbloquear',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de mensajero',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.updateStatusMessenger(this.acctionsMessengers[index].value, '1')
            ),
            'Desbloqueando mensajero',
            'Mensajero desbloqueado',
            'Error en servicio'
          );
        }
      },
      {
        name: 'Asignación de Pedido a Mensajero',
        actionName: 'Asignar',
        multiInput: [
          {
            value: '',
            inputType: 'number',
            inputPlaceholder: 'Número de orden',
          },
          {
            value: '',
            inputType: 'number',
            inputPlaceholder: 'Número de mensajero',
          },
        ],
        action: (multiInput:Array<InputUtil>)=>{
          const promises = [
            firstValueFrom(this._uS.isOrderTake(multiInput[0].value)),
            firstValueFrom(this._uS.setStatusAssignedOrder(multiInput[1].value,multiInput[0].value)),
            firstValueFrom(this._uS.setOrderMessenger(multiInput[1].value,multiInput[0].value))
          ]
          this._uS.basicLoadPromise(
            Promise.all(promises),
            'Asiginando orden a mensajero',
            'Orden asignada correctamente',
            'Error asginando orden'
          );
        }
      },
    ]
    this.acctionsRelease = [
      {
        name: 'Eliminación de carrito',
        actionName: 'Eliminar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de cliente',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.cartDeleteAndCoupon(this.acctionsRelease[index].value),
            ),
            'Eliminando carrito',
            'Carrito Eliminado',
            'Error eliminando carrito'
          );
        }
      },
      {
        name: 'Liberar orden',
        actionName: 'Liberar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de orden',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.releaseOrder(this.acctionsRelease[index].value)
            ),
            'Liberando orden',
            'Orden liberada',
            'Error liberando orden'
          );
        }
      },
    ]
  }

  private getActionsVenezuela(){
    this.acctionsRelease = [
      {
        name: 'Eliminación de carrito',
        actionName: 'Eliminar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de cliente',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.cartDeleteAndCoupon(this.acctionsRelease[index].value)
            ),
            'Eliminando carrito',
            'Carrito Eliminado',
            'Error eliminando carrito'
          );
        }
      },
      {
        name: 'Liberar orden',
        actionName: 'Liberar',
        value: '',
        inputType: 'number',
        inputPlaceholder: 'Número de orden',
        action: (index:number)=>{
          this._uS.basicLoadPromise(
            firstValueFrom(
              this._uS.releaseOrder(this.acctionsRelease[index].value)
            ),
            'Liberando orden',
            'Orden liberada',
            'Error liberando orden',
            (isCorrect, value) => {
              if(isCorrect) this._uS.releaseInFirebase(this.acctionsRelease[index].value);
            }
          );
        }
      }
    ]
  }

}
