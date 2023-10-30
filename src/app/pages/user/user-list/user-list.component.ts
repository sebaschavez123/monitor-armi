import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ColumnData, User } from '../../../core/interfaces';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users:Array<User>;
  cols:Array<ColumnData> = [];
  userSelected:User;
  searchText:string;

  private usersAux:Array<User> = [];

  constructor(private _uS:UserService, private _dS:DashboardService) {}

  ngOnInit(): void {
    this.cols = this._uS.getCols();
    this.getUsers();
  }

  register(){
    this.userSelected = {
      employeeNumber: null,
      storeId:null,
      storeName:null,
      storeAddress:null,
      rolUser:null,
      sessionToken:null,
      message:null,
      employeeName:null,
      email:null,
      employeePhone:null
    }
  }

  delete(user:User, index:number, event:Event){
    if(user?.rolId !== 10){
      event.stopPropagation();
        Swal.fire({
          title: 'Confirmación',
          text: '¿Realmente desea eliminar el usuario: '+user.employeeName+' ? ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'SI',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
              this._uS.basicLoadPromise(
                this._uS.deleteUser(user.employeeNumber).toPromise(),
                'Eliminando Usuario!',
                'Usuario eliminado exitosamente',
                'Ha ocurrido un error en servicio',
                (success:boolean) => {
                  if(success){
                    const users = this.users.slice(0);
                    users.splice(index, 1);
                    this.users = users;
                  };
                }
              );
          }
        });
    }
  }

  refresh($event){
    if($event.type === 'create') this.users.unshift($event.user);
    else if($event.type === 'edit'){
      const index = this.users.findIndex(user => user.employeeNumber === $event.user.employeeNumber);
      if(index !== -1) this.users.splice(index, 1, $event.user);
    }
    this.userSelected = undefined;
  }

  searchData(){
    if(this.searchText !== ''){
      if(this.usersAux.length === 0) this.usersAux = this.users.slice(0);
      this.users = this.usersAux
      .filter(i=> i.employeeName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 || String(i.employeeNumber)
      .indexOf(this.searchText) !== -1 || i.email.indexOf(this.searchText) !== -1);
    }else{
      this.users = this.usersAux;
      this.usersAux = [];
    }
  }

  private getUsers(){
  	this._uS.getUsers().subscribe((rta:any) => {
      this.users = rta.data.filter(user => user.rolName !== 'MENSAJERO');
    },
    error => {this.users = []});
  }

}
