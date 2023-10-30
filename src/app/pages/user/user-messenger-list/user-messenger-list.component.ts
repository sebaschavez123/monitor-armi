import { filter } from 'rxjs/operators';
import { Component,  OnInit } from '@angular/core';
import { User, ColumnData } from '../../../core/interfaces';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ExportsService } from 'src/app/services/exports.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { countryConfig } from 'src/country-config/country-config';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-messenger-list',
  templateUrl: './user-messenger-list.component.html',
  styleUrls: ['./user-messenger-list.component.scss']
})
export class UserMessengerListComponent implements OnInit {

  users:Array<User>;
  cols:Array<ColumnData> = [];
  userSelected:User;
  searchText:string = '';
  permissions = {create: true, edit: true};
  uploading = false;
  countryConfig = countryConfig;
  dataCsv;
  userData;
  rejectionPhoto:boolean=false;
  isValidPhoto:number;
  dataExport: any;
  dataSearch: any;
  isOpen:boolean=false;
  form:UntypedFormGroup;
  saveOption: any | number;
  userAuxFilter:Array<User>;
 
  options = [
    { optionName: 'Sin foto', isSelect: false, option: 4 },
    { optionName: 'Pendiente', isSelect: false, option: 0 },
    { optionName: 'Aprobada', isSelect: false, option: 1 },
    { optionName: 'Rechazada', isSelect: false, option: 2 }
  ];
  private usersAux:Array<User> = [];

  constructor(private _uS:UserService,
    private _dS:DashboardService,
    private _eS:ExportsService,
    private msg: NzMessageService, 
    private toastr: ToastrService) { 
      this.form = new UntypedFormGroup({
        reason: new UntypedFormControl(null, Validators.required)})
    }

  ngOnInit(): void {
    this.cols = this._uS.getCols();
    this.cols.splice(4,0, {
      name: 'courierName',
      header: 'Courier',
      label: 'Courier'
    })
    this.cols.splice(5,1, {
      name: 'employeePhone',
      header: 'Télefono',
      label: 'Télefono'
    })
  
    this.getUsers();
    const actionsM = this._dS.getPermissions('users');
    if(Object.keys(actionsM).length > 0) {
      this.permissions.create = actionsM.create;
      this.permissions.edit = actionsM.edit;
    }
    this.initConfOptions();
  }

  editUser(user) {
    this.userSelected = user;
  }
  handleCancel(){
    this.isOpen=false;
  }

  approvePhoto(user){
    this.form.reset()
    this.rejectionPhoto = false;
    this.userData = user;
    this.isOpen = true;
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
 
  refresh($event){
    if($event.type === 'create') this.users.unshift($event.user);
    else if($event.type === 'edit'){
      const index = this.users.findIndex(user => user.employeeNumber === $event.user.employeeNumber);
      if(index !== -1) this.users.splice(index, 1, $event.user);
    }
  }


  searchData(){
    let dataUsersWithFilterCheck=[];
    if(this.searchText !== ''){
      if(this.usersAux?.length === 0) this.usersAux = this.users.slice(0);
      this.users?.length > 0 ? dataUsersWithFilterCheck = this.users : dataUsersWithFilterCheck = this.usersAux;
      
     this.users = dataUsersWithFilterCheck
      .filter(i=> i.employeeName.toLowerCase()
      .indexOf(this.searchText.toLowerCase()) !== -1 || String(i.employeeNumber)
      .indexOf(this.searchText) !== -1 || i.email.indexOf(this.searchText) !== -1);
    }else{
      this.users = this.usersAux; 
    }

    if(this.saveOption?.isSelect){
      this.filterUsersByOption();
    }

  }

  filterByStatePhoto(option?: any, index?: number) {
    if(!this.saveOption?.isSelect){
      this.users = this.usersAux;
    }
    this.saveOption = option;
    this.saveOption?.isSelect && this.filterUsersByOption();
    this.onOptionChange(index);
    this.searchData();
  }

  filterUsersByOption() {
    let result = this.users;
    result = result?.filter(user => {
      return user?.isValidImage === undefined && this.saveOption?.option === 4 ?
        user?.isValidImage === undefined :
        user?.isValidImage === this.saveOption?.option;
    });

    this.users = result?.length > 0 ? result : [];
  }

  private getUsers(){
  	this._uS.getUsers(true).subscribe((rta:any) => {
      this.users = rta.data.filter(user => user.rolName === 'MENSAJERO');
      this.usersAux = this.users;
      this.userAuxFilter = this.users;
    },
    error => {this.users = []});
  }

  beforeUpload = (file: File): boolean => {
    if(file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.msg.error('Solo puedes cargar archivos excel');
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      this.msg.error('Archivo muy pesado, solo se permiten hasta 10MB!');
      return false;
    }
    const reader = new FileReader();
    let workBook = null;
    let jsonData: Array<any> = null;
    this.uploading = true;
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name, i) => {
        const sheet = workBook.Sheets[name];
        return XLSX.utils.sheet_to_json(sheet);
      }, {});
      if (jsonData == null || jsonData.length === 0) {
       this.msg.error('Archivo sin data');
       this.uploading = false;
        return false;
      }
      if (!this.validateDataCsv(jsonData)) {
       this.msg.error('Archivo CSV contiene error en la data');
       this.uploading = false;
        return false;
      }
      this.dataCsv = jsonData;
      this.handleUpload();
    }
    reader.readAsBinaryString(file);
    return true;
  }

  private validateDataCsv(arrayData:Array<any>) {
    let valid = true;

    const BreakException = {};

    try {
      for (const user of arrayData) {
        if(user.active == null || user.cityId == null || user.email == null || user.employeeName == null
          || user.employeeNumber == null || user.employeePhone == null || user.messengerProviderId == null
          || user.vehicleTypeId == null || user.password == null) {
          valid = false;
          throw BreakException;
        }
        if(String(user.employeePhone).indexOf('58') === -1) {
          valid = false;
          throw BreakException;
        }
        if(String(user.email).indexOf('@') === -1) {
          valid = false;
          throw BreakException;
        }
      }
    } catch (e) {
      valid = false;
      if (e !== BreakException) throw e;
    }

    return valid;
  }

  async handleUpload() {
    this.uploading = true;
    this._uS.basicLoadPromise(
      this._uS.updateMessengerList(this.dataCsv).toPromise(),
      'Actualizando mensajeros',
      'Mensajeros actualizados',
      'Ha ocurrido un error',
      () => {
        this.dataCsv = [];
        this.uploading = false;
        this.getUsers();
      }
    );
  }

  export() {
    this._eS.generateDirect(this.dataSearch, this.dataExport);
  }

  private initConfOptions(){
    this.dataExport = {
      extras: [],
      object: {
        employeeNumber: {field: 'employeeNumber'},
        employeeName: {field: 'employeeName'},
        active: {field: 'active'},
        cityId: {field: 'cityId'},
        messengerProviderId: {field: 'messengerProviderId'},
        email: {field: 'email'},
        employeePhone: {field: 'employeePhone'},
        vehicleTypeId: {field: 'vehicleTypeId'},
        password: {field: 'password'},
    },
      modifications: [],
      nameReport: 'Mensajeros',
      filter: (data:Array<any>)=> {return data.filter(m => m.rolName === 'MENSAJERO');}
    }
    this.dataSearch = {
        direct: {
          url: this._uS.urls.users,
          method: 'get',
          req: {}
        },
    }
  }

  validateApproval(code: number){
    this.isValidPhoto = code;
    code === 1 ? this.postValidateImageMessenger(null) : this.rejectionPhoto = true;
  }

  sendReason(){
    if(this.form.valid) this.postValidateImageMessenger(this.form.get('reason').value);
  }

  postValidateImageMessenger(reason?: string){
    this._uS.validateImageMessenger(reason, this.isValidPhoto, this.userData.employeeNumber).subscribe((res:any)=>{
      if(res?.code === 'OK') this.toastr.success("La respuesta ha sido enviada", null);
      if(res?.code !== 'OK') this.toastr.error("Ha ocurrido un error", null);
      this.isOpen=false;
      this.form.reset()
    })
  }

  get restoreUsers(){
    return  this.users = !this.searchText ? this.userAuxFilter : this.users
  }



  getStatusName(isValidImage: any): string {
    
      const statusMap = {
        "2": 'Rechazada',
        "1": 'Aprobada',
        "0": 'Pendiente',
        "undefined": 'Sin foto'
      };
      return statusMap[isValidImage];
  }

  onOptionChange(selectedIndex: number) {
    this.options.forEach((option, i) => {
      if (i !== selectedIndex) {
        option.isSelect = false;
      }
    });
  }
}
