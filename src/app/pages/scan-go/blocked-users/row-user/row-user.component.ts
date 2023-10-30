import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'row-user',
  templateUrl: './row-user.component.html',
  styleUrls: ['./row-user.component.css']
})
export class RowUserComponent implements OnInit {

  @Input() customer:any;
  @Output() eventUnlock = new EventEmitter();
  hide:boolean = false;

  constructor(private _uS:UserService) { }

  ngOnInit() {
  }


  toUnlock(){
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea desbloquear el usuario: '+this.customer.firstName+' ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
        if (result.value) {
        this._uS.basicLoadPromise( this._uS.unblockUser(this.customer.id).toPromise(),
        'Se desbloqueo este usuario!',
        'La orden fue reimpulsada correctamente',
        'No es posible reimpulsar la orden',
        (ct, data)=>{if(ct) this.eventUnlock.emit();}
        );
      }
    });
  }

}
