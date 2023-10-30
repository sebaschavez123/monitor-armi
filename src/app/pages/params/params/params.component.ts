import { Component, OnInit } from '@angular/core';
import { Param, InputUtil } from '../../../core/interfaces';
import { ParamsService } from 'src/app/services/params.service';
import { DashboardService } from '../../../services/dashboard.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
  selector: 'app-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss']
})
export class ParamsComponent implements OnInit {

  paramsGeneral:Array<Param> = [];
  paramsMessengers:Array<Param> = [];
  actionEdit:Param;
  citiesMessengers:Array<any> =[];
  countryConfig = countryConfig;

  constructor(private _pS:ParamsService,
              private _dS:DashboardService) { }

  ngOnInit(): void {
    this.citiesMessengers = [
      {name: 'Barranquilla', key: 'APP_MAXIMUM_ORDER_BAR'},
      {name: 'Bogota', key: 'APP_MAXIMUM_ORDER_BOG'},
      {name: 'Bucaramanga', key: 'APP_MAXIMUM_ORDER_BUC'},
      {name: 'Cali', key: 'APP_MAXIMUM_ORDER_ALI'},
      {name: 'Cartagena', key: 'APP_MAXIMUM_ORDER_CTG'},
      {name: 'Chia', key: 'APP_MAXIMUM_ORDER_CHI'},
      {name: 'Cota', key: 'APP_MAXIMUM_ORDER_CTA'},
      {name: 'Cucuta', key: 'APP_MAXIMUM_ORDER_CUT'},
      {name: 'La Calera', key: 'APP_MAXIMUM_ORDER_LAC'},
      {name: 'Medellin', key: 'APP_MAXIMUM_ORDER_MED'},
      {name: 'Monteria', key: 'APP_MAXIMUM_ORDER_TER'},
      {name: 'Santa Marta', key: 'APP_MAXIMUM_ORDER_SMR'},
      {name: 'Sohacha', key: 'APP_MAXIMUM_ORDER_SOA'},
      {name: 'Valledupar', key: 'APP_MAXIMUM_ORDER_VUP'},
      {name: 'Villavicencio', key: 'APP_MAXIMUM_ORDER_VVC'},
    ]
    this.getParams();
    this.getValues();
  }

  canChangeStoreSchedule() {
    // return false;
    return !countryConfig.isColombia
      ? (this._dS.getLocalUser().canChangeStoreSchedule === 1)
      : true;
  }

  changeModelSelect(data:Param){
    data.currentValue = null;
    if (data.change) {
      data.change(data.optionSelected);
      return;
    }
    this._pS.getProperty(data.optionSelected).subscribe((res:any)=>{
      data.currentValue = res.data.message;
    }, error=>{data.currentValue = ''});
  }

  verifyAction(data:any){
    if(data.multiInput){
      for (const input of data.multiInput) {
        if(!input.value || input.value === '') return true;
      }
      return false
    }else return !data.value || data.value === '';
  }


  private getParams(){
    if (countryConfig.isColombia) {
      this.paramsGeneral = [
        {
          name: 'Valor de Domicilio',
          value: '',
          currentValue: null,
          inputType: 'number',
          inputPlaceholder: 'Nuevo valor de domicilio',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.setDeliveryValueMessenger(param.value).toPromise(),
              'Actualizando valor de dmicilio',
              'Valor del domicilio actualizada exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = this._dS.formatMoney(param.value, 0,  '.', ',');
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Tiempo de visualización de compras en Scan&Go',
          value: '',
          currentValue: null,
          inputType: 'number',
          inputPlaceholder: 'Nuevo tiempo en minutos',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty('SCAN_AND_GO_TIME_WAIT', Number(param.value)).toPromise(),
              'Actualizando tiempo en SAG',
              'Tiempo actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value + ' minuto(s)';
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Lanzamiento de ordenes express',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsValue: [
            {name: 'Activado', key: 'ACTIVADO'},
            {name: 'Desactivado', key: 'DESACTIVADO'},
          ],
          inputPlaceholder: 'Status',
          action: (param:Param)=>{
            this._pS.basicLoadPromise( 
              this._pS.updateProperty('LAUNCH_ORDERS_EXPRESS',param.value).toPromise(),
              'Actualizando status de lanzamiento de ordenes express',
              'Status actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Tiempo de lanzamiento de ordenes express',
          value: '',
          currentValue: null,
          inputType: 'number',
          inputPlaceholder: 'Nuevo tiempo en minutos',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty('TIME_TO_LAUNCH_ORDERS_EXPRESS', Number(param.value)).toPromise(),
              'Actualizando tiempo en lanzamiento',
              'Tiempo actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value + ' minuto(s)';
                  param.value = '';
                }
              }
            );
          }
        },
      ]
      this.paramsMessengers = [
        {
          name: 'Maximo Ordenes permitidas por mensajero en',
          value: '',
          currentValue: null,
          hide: true,
          inputType: 'number',
          optionsSelect: this.citiesMessengers,
          optionSelected: 'APP_MAXIMUM_ORDER_BOG',
          inputPlaceholder: 'Número máximo de ordenes',
          action: (param:Param)=>{
            let citySelect: any;
            citySelect = this.citiesMessengers.filter(city=> city?.key === param?.optionSelected)
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando maximo ordenes permitidas',
              'maximo ordenes permitidas actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                let changes=[
                  {"newValues": `ciudad=${citySelect[0]?.name},maxOrdenes=${param.value}`}
                ]
                if(countryConfig.isColombia){
                  this._pS.logProperty( 5, changes)
                  .subscribe({
                    error: (error: any) => {
                      console.log(error);
                    }
                  });
                }
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Tamaño de radio al rededor de tienda',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: [
            {name: 'Radio 1', key: 'RADIO_DELIVERY_COURIER_1'},
            {name: 'Radio 2', key: 'RADIO_DELIVERY_COURIER_2'},
            {name: 'Radio 3', key: 'RADIO_DELIVERY_COURIER_3'}
          ],
          optionSelected: 'RADIO_DELIVERY_COURIER_1',
          inputPlaceholder: 'Tamaño de radio',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando tamaño de radio',
              'Tamaño de radio actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Minutos de espera por radio para push',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: [
            {name: 'Radio 1', key: 'APP_MINUTES_RADIO1'},
            {name: 'Radio 2', key: 'APP_MINUTES_RADIO2'},
          ],
          optionSelected: 'APP_MINUTES_RADIO1',
          inputPlaceholder: 'Tamaño de radio',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando minutos de espera',
              'Minutos de espera actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
      ]
    } else {
      this.paramsGeneral = [
        {
          name: 'Min Stock en',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: this._dS.cities.slice(0).map(i => { return {name: i.label, key: 'MINIMUN_STOCK_'+i.value}}),
          optionSelected: 'MINIMUN_STOCK_CCS',
          inputPlaceholder: 'Stock minímo',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando stock minimo',
              'Stock minimo actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Km máximo bicicleta en',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: this._dS.cities.slice(0).map(i => { return {name: i.label, key: 'MAX_KM_BICICLETA_'+i.value}}),
          optionSelected: 'MAX_KM_BICICLETA_CCS',
          inputPlaceholder: 'Kilometraje máximo en bicicleta',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando kilometraje máximo en bicicleta',
              'Kilometraje máximo en bicicleta actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Km máximo carro en',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: this._dS.cities.slice(0).map(i => { return {name: i.label, key: 'MAX_KM_CARRO_'+i.value}}),
          optionSelected: 'MAX_KM_CARRO_CCS',
          inputPlaceholder: 'Kilometraje máximo en carro',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando kilometraje máximo en carro',
              'Kilometraje máximo en carro actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Km máximo moto en',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: this._dS.cities.slice(0).map(i => { return {name: i.label, key: 'MAX_KM_MOTO_'+i.value}}),
          optionSelected: 'MAX_KM_MOTO_CCS',
          inputPlaceholder: 'Kilometraje máximo en moto',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando kilometraje máximo en moto',
              'Kilometraje máximo en moto actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Horario de tienda',
          optionsSelect: this._dS.stores.slice(0).map(i => { return {name: i.name, key: i.id}}),
          optionSelected: 311,
          currentValue: null,
          hide: !this.canChangeStoreSchedule(),
          multiInput: [
            {
              value: '',
              inputType: 'time',
              inputPlaceholder: 'Hora de apertura',
            },
            {
              value: '',
              inputType: 'time',
              inputPlaceholder: 'Hora de cierre',
            },
          ],
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.setStoreHours(param.optionSelected, param.multiInput[0].value+':00', param.multiInput[1].value+':00').toPromise(),
              'Cambio de horario exitoso',
              'El horario de la tienda ha sido actualizado exitosamente',
              'Error cambiando horario',
              (ct,res)=>{
                if(ct){
                  param.currentValue = res.data.startTime + ' - '+ res.data.endTime;
                  param.value = '';
                }
              }
            );
          },
          validation: (param:Param) => {
            const start:string = param.multiInput[0].value;
            const end:string = param.multiInput[1].value;
            return start.length > 0 && end.length > 0 && new Date(start) < new Date(end)
          },
          change: (optionSelected) => {
            this._pS.getStoreHours(optionSelected).subscribe((res:any)=>{
              if(!!this.paramsGeneral[4]) {
                this.paramsGeneral[4].currentValue = res.data.startTime + ' - '+ res.data.endTime;
              }
            });
          }
        },
        {
          name: 'Monto de ordenes con alto costo',
          value: '',
          currentValue: null,
          inputType: 'number',
          inputPlaceholder: 'Nuevo monto',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty('HIGH_PRICE_ORDER', Number(param.value)).toPromise(),
              'Actualizando monto',
              'Monto actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = "Bs. "+param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        {
          name: 'Cantidad de SKU Dashboard posible demora',
          value: '',
          currentValue: null,
          inputType: 'number',
          inputPlaceholder: 'Nueva cantidad SKU',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty('SKUS_FOR_DELAY_DASHBOARD', Number(param.value)).toPromise(),
              'Actualizando tiempo en lanzamiento',
              'Tiempo actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value + ' SKU(s)';
                  param.value = '';
                }
              }
            );
          }
        }
      ];
      this.paramsMessengers = [
        {
          name: 'Ordenes permitidas por mensajero en',
          value: '',
          currentValue: null,
          inputType: 'number',
          optionsSelect: this._dS.cities.slice(0).map(i => { return {name: i.label, key: 'APP_MAXIMUM_ORDER_'+i.value}}),
          optionSelected: 'APP_MAXIMUM_ORDER_CCS',
          inputPlaceholder: 'Número de ordenes permitidas',
          action: (param:Param)=>{
            this._pS.basicLoadPromise(
              this._pS.updateProperty(param.optionSelected, Number(param.value)).toPromise(),
              'Actualizando número de ordenes permitidas',
              'Número de ordenes permitidas actualizado exitosamente',
              'Error en servicio',
              (ct,res)=>{
                if(ct){
                  param.currentValue = param.value;
                  param.value = '';
                }
              }
            );
          }
        },
        // {
        //   name: 'Radio #1 al rededor de tienda',
        //   value: '',
        //   currentValue: null,
        //   inputType: 'number',
        //   optionSelected: 'RADIO_DELIVERY_COURIER_1',
        //   inputPlaceholder: 'Tamaño de radio',
        //   action: (param:Param)=>{
        //     this._pS.basicLoadPromise(
        //       this._pS.updateProperty('RADIO_DELIVERY_COURIER_1', Number(param.value)).toPromise(),
        //       'Actualizando tamaño de radio',
        //       'Tamaño de radio actualizado exitosamente',
        //       'Error en servicio',
        //       (ct,res)=>{
        //         if(ct){
        //           param.currentValue = param.value;
        //           param.value = '';
        //         }
        //       }
        //     );
        //   }
        // },
        // {
        //   name: 'Radio #2 al rededor de tienda',
        //   value: '',
        //   currentValue: null,
        //   inputType: 'number',
        //   optionSelected: 'RADIO_DELIVERY_COURIER_2',
        //   inputPlaceholder: 'Tamaño de radio',
        //   action: (param:Param)=>{
        //     this._pS.basicLoadPromise(
        //       this._pS.updateProperty('RADIO_DELIVERY_COURIER_2', Number(param.value)).toPromise(),
        //       'Actualizando tamaño de radio',
        //       'Tamaño de radio actualizado exitosamente',
        //       'Error en servicio',
        //       (ct,res)=>{
        //         if(ct){
        //           param.currentValue = param.value;
        //           param.value = '';
        //         }
        //       }
        //     );
        //   }
        // },
        // {
        //   name: 'Radio #3 al rededor de tienda',
        //   value: '',
        //   currentValue: null,
        //   inputType: 'number',
        //   optionSelected: 'RADIO_DELIVERY_COURIER_3',
        //   inputPlaceholder: 'Tamaño de radio',
        //   action: (param:Param)=>{
        //     this._pS.basicLoadPromise(
        //       this._pS.updateProperty('RADIO_DELIVERY_COURIER_3', Number(param.value)).toPromise(),
        //       'Actualizando tamaño de radio',
        //       'Tamaño de radio actualizado exitosamente',
        //       'Error en servicio',
        //       (ct,res)=>{
        //         if(ct){
        //           param.currentValue = param.value+' minutos';
        //           param.value = '';
        //         }
        //       }
        //     );
        //   }
        // },
        // {
        //   name: 'Minutos de espera de notificación push para radio #1',
        //   value: '',
        //   currentValue: null,
        //   inputType: 'number',
        //   optionSelected: 'APP_MINUTES_RADIO1',
        //   inputPlaceholder: 'Minutos',
        //   action: (param:Param)=>{
        //     this._pS.basicLoadPromise(
        //       this._pS.updateProperty('APP_MINUTES_RADIO1', Number(param.value)).toPromise(),
        //       'Actualizando minutos de espera',
        //       'Minutos de espera actualizado exitosamente',
        //       'Error en servicio',
        //       (ct,res)=>{
        //         if(ct){
        //           param.currentValue = param.value+' minutos';
        //           param.value = '';
        //         }
        //       }
        //     );
        //   }
        // },
        // {
        //   name: 'Minutos de espera de notificación push para radio #2',
        //   value: '',
        //   currentValue: null,
        //   inputType: 'number',
        //   optionSelected: 'APP_MINUTES_RADIO2',
        //   inputPlaceholder: 'Minutos',
        //   action: (param:Param)=>{
        //     this._pS.basicLoadPromise(
        //       this._pS.updateProperty('APP_MINUTES_RADIO2', Number(param.value)).toPromise(),
        //       'Actualizando minutos de espera',
        //       'Minutos de espera actualizado exitosamente',
        //       'Error en servicio',
        //       (ct,res)=>{
        //         if(ct){
        //           param.currentValue = param.value;
        //           param.value = '';
        //         }
        //       }
        //     );
        //   }
        // },
      ];
    }
  }

  private getValues(){
    if(countryConfig.isColombia) {
      this._pS.getDeliveryValueMessenger().subscribe(
      (rta:any) => {
        let value = '0';
        if (rta.code === 'OK' && rta.data != null) value = rta.data.message
        this.setParamsGeneral(0, this._dS.formatMoney(value, 0,  '.', ','));
      },
      error => {
        this.setParamsGeneral(0, this._dS.formatMoney('0', 0,  '.', ','));
      });
      this._pS.getProperty('SCAN_AND_GO_TIME_WAIT').subscribe((res:any)=>{
        this.setParamsGeneral(1, res.data.message + ' minuto(s)');
      })
      this._pS.getProperty('LAUNCH_ORDERS_EXPRESS').subscribe((res:any)=>{
        this.setParamsGeneral(2, res.data.message);
      })
      this._pS.getProperty('TIME_TO_LAUNCH_ORDERS_EXPRESS').subscribe((res:any)=>{
        this.setParamsGeneral(3, res.data.message + ' minuto(s)');
      })
      this._pS.getProperty(this.paramsMessengers[0].optionSelected).subscribe((res:any)=>{
        this.setParamsMessengers(0, res.data.message);
      })
      this._pS.getProperty(this.paramsMessengers[1].optionSelected).subscribe((res:any)=>{
        this.setParamsMessengers(1, res.data.message);
      })
      this._pS.getProperty(this.paramsMessengers[2].optionSelected).subscribe((res:any)=>{
        this.setParamsMessengers(2, res.data.message);
      })
    } else {
      this._pS.getProperty(this.paramsGeneral[0].optionSelected).subscribe((res:any)=>{
        this.setParamsGeneral(0, res.data.message);
      });
      this._pS.getProperty(this.paramsGeneral[1].optionSelected).subscribe((res:any)=>{
        this.setParamsGeneral(1, res.data.message);
      });
      this._pS.getProperty(this.paramsGeneral[2].optionSelected).subscribe((res:any)=>{
        this.setParamsGeneral(2, res.data.message);
      });
      this._pS.getProperty(this.paramsGeneral[3].optionSelected).subscribe((res:any)=>{
        this.setParamsGeneral(3, res.data.message);
      });
      this._pS.getStoreHours(this.paramsGeneral[4].optionSelected).subscribe((res:any)=>{
        this.setParamsGeneral(4, res.data.startTime + ' - '+ res.data.endTime);
      });
      this._pS.getProperty('HIGH_PRICE_ORDER').subscribe((res:any)=>{
        this.setParamsGeneral(5, 'Bs. '+res.data.message);
      });
      this._pS.getProperty('SKUS_FOR_DELAY_DASHBOARD').subscribe((res:any)=>{
        this.setParamsGeneral(6, res.data.message + ' SKU(s)');
      });
    }
    this._pS.getProperty(this.paramsMessengers[0]?.optionSelected).subscribe((res:any)=>{
      this.setParamsMessengers(0, res.data.message);
    })
    this._pS.getProperty('RADIO_DELIVERY_COURIER_1').subscribe((res:any)=>{
      this.setParamsMessengers(1, res.data.message+' km');
    })
    this._pS.getProperty('RADIO_DELIVERY_COURIER_2').subscribe((res:any)=>{
      this.setParamsMessengers(2, res.data.message+' km');
    })
    this._pS.getProperty('RADIO_DELIVERY_COURIER_3').subscribe((res:any)=>{
      this.setParamsMessengers(3, res.data.message+' km');
    })
    this._pS.getProperty('APP_MINUTES_RADIO1').subscribe((res:any)=>{
      this.setParamsMessengers(4, res.data.message+' minutos');
    })
    this._pS.getProperty('APP_MINUTES_RADIO2').subscribe((res:any)=>{
      this.setParamsMessengers(5, res.data.message+ ' minutos');
    })
  }

  setParamsMessengers(index: number, value: any) {
    if(!!this.paramsMessengers[index])
      this.paramsMessengers[index].currentValue = value;
  }

  setParamsGeneral(index: number, value: any) {
    if(!!this.paramsGeneral[index])
      this.paramsGeneral[index].currentValue = value;
  }
}
