import { Component, OnInit} from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

declare var ol: any;
@Component({
  selector: 'modal-observations',
  templateUrl: './observations.component.html',
  styleUrls:  ['./observations.component.scss']
})
export class ObservationsComponent implements OnInit {

  isVisible: boolean = false;
  orderId: string = '15473132';

  observations = []

  constructor (private _dS: DashboardService) {
    this._dS.observationEvent.subscribe( ({action, params}) => {
      if(action == 'open' && !!params.orderId) { 
        this.orderId = params.orderId;
        this.showModal();
      }
    });
  }

  ngOnInit () {
  }

  getTitle(data) {
    return (data == 'AGENT')
     ? 'Agente'
     : (data == 'MESSENGER')
      ? 'Mensajero' : 'Cliente'
  }

  showModal(): void {
    this._dS.getObservationTacking(this.orderId).subscribe((resp: any) => {
      this.observations = resp;
      this.isVisible = true;
    });
  }
  hideModal(): void {
    this.orderId = null;
    this.observations = [];
    this.isVisible = false;
  }
  
}
