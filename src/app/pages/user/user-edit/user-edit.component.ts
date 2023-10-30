import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators,
  AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User, Rol, Store, States, Municipalities } from '../../../core/interfaces';
import { UserService } from '../../../services/user.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { countryConfig } from 'src/country-config/country-config';
import { BaseService } from '../../../services/base.service';
import Swal from 'sweetalert2'
import * as _ from 'underscore';
import * as moment from 'moment-mini-ts';

const now: moment.Moment = moment();

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() messengers = false;
  @Input() pageMode = false;
  // tslint:disable-next-line: no-output-native
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();

  form: UntypedFormGroup;
  // tslint:disable-next-line: variable-name
  form_error: string;
  loadingForm = false;
  editMode = false;
  rols: Array<Rol> = [];
  stores: Array<Store> = [];
  states: Array<States> = [];
  municipalities: Array<Municipalities> = [];
  isBloqued = false;
  countryConfig = countryConfig;
  permissions = { create: true, edit: true };
  storesTags = [];
  inputVisible = false;
  storesAllowed = [];
  filesRif = [];
  filesIds = [];
  filesPhoto = [];
  messengerList = [];
  genderList = ['MASCULINO', 'FEMENINO'];
  isArmirene = false;
  reasonsResponse: any;
  countryPre = countryConfig.countryName.split('');
  headers = countryConfig.headersNgZorro;
  loading = false;
  avatarUrl?: string;
  messageFormMessengerError: boolean = false;
  defaultBirthDate = moment().subtract(18, 'years').toDate();

  useNewServiceCourier = this.countryConfig.endpoints.courier.useNewService;

  nzShowUploadList = { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false };
  nzShowUploadListPhoto = { showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: false };
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  constructor(
    private _uS: UserService,
    public _dS: DashboardService,
    private toast: ToastrService,
    private _bS: BaseService
  ) {
    this.getUsers();
    this.form = new UntypedFormGroup({
      documentNumber: new UntypedFormControl(null, []),
      employeeNumber: new UntypedFormControl(null, [Validators.required]),
      storeId: new UntypedFormControl(null, [Validators.required]),
      rolUser: new UntypedFormControl(null, [Validators.required]),
      employeeName: new UntypedFormControl(null, [Validators.required]),
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      state: new UntypedFormControl(null),
      municipality: new UntypedFormControl(null),
      bankAccountType: new UntypedFormControl(null),
      storesAllowed: new UntypedFormControl(null),
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      employeePhone: new UntypedFormControl(null, [Validators.required, Validators.minLength(countryConfig.isColombia ? 10 : 9)]),
      courierId: new UntypedFormControl(0),
      phonePrefix: new UntypedFormControl(countryConfig.isColombia ? '57' : '58', [Validators.required]),
      secondLastName: new UntypedFormControl(null),
      referredMessenger: new UntypedFormControl(null),
      rif: new UntypedFormControl(""),
      address: new UntypedFormControl(null),
      bankAccount: new UntypedFormControl(null),
      hasTicketBook: new UntypedFormControl(false),
      urlRif: new UntypedFormControl(null),
      urlDocument: new UntypedFormControl(null),
      contributor: new UntypedFormControl(false),
      gender: new UntypedFormControl(null),
      birthDate: new UntypedFormControl(null),
      urlPhoto: new UntypedFormControl(null),
      vehicleName: new UntypedFormControl(null)
    });
  }

  ngOnInit(): void {
    this.setStatesAndMunicipalities();
    this.getRols();
    const actionsM = this._dS.getPermissions('users');
    
    if (Object.keys(actionsM).length > 0) {
      this.permissions.create = actionsM.create;
      this.permissions.edit = actionsM.edit;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.user) {
      if (!this.user) {
        this.clearForm();
        return;
      }
      if (this.user.employeeNumber) this.dataUpdate();
      if (this.messengers) {
        this.setValuesMessengers();
      }

      setTimeout(() => {
        Object.values(this.form.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }, 500);
    }
  }

  get formControls() {
    return this.form.controls;
  }

  get canBlockCouriers() {
    return this._dS.getLocalUser().canBlockCouriers == 1;
  }

  get canChangeStoreSchedule() {
    return this._dS.getLocalUser().canChangeStoreSchedule == 1;
  }

  setStatesAndMunicipalities() {
    if (!countryConfig.isVenezuela) { return; }
    this._dS.getStatesAndMunicipalities().subscribe((res: any) => {
      this.states = res.data.states;
      this.municipalities = res.data.municipalities;
    });
  }

  action() {
    this.loadingForm = true;
    this.form_error = undefined;
    const user: any = this.form.value;
    user.employeeNumber = this.formControls.employeeNumber.value;
    user.rolUser = this.rols.slice(0).filter(rol => String(rol.id) === String(this.formControls.rolUser.value))[0]?.name;
    user.employeePhone = this.formControls.phonePrefix.value + this.formControls.employeePhone.value;
    if (this.isShowStore()) { // todas las tiendas
      user.listStoresId = this.getStoresAllowed();
    } else {
      user.storeId = 0;
      user.listStoresId = [];
    }
    user.secondLastName = user.secondLastName || 'null';
    if (user.referredMessenger == null) { delete user.referredMessenger; }
    if (this.messengers) user.active = user.active ? 1 : 0;
    if (user?.birthDate) user.birthDate = user?.birthDate?.toJSON()?.slice(0, 10);
    if (this.editMode) {
      this.formControls.employeePhone.disable();
      this.fieldEditable(this.formControls.birthDate);
      delete user.password;
      this.messageFormMessengerError = false;
      if (user.rolUser === 'MENSAJERO' && countryConfig.isColombia) {
        if(this.formControls.courierId?.value == 'APOYO_FTD' ){
          
          if (this.formControls.cityName.value !== null && this.formControls.providerName?.value !== null && this.formControls.vehicle?.value !== null) {
          
            this.updateUser(user);
          } else {
            this.loadingForm = false;
            this.messageFormMessengerError = true;
          }
        }else{
          if (this.formControls.cityName.value !== null && this.formControls.vehicle?.value !== null) {
          
            this.updateUser(user);
          } else {
            this.loadingForm = false;
            this.messageFormMessengerError = true;
          }
        }
          
        
      } else {
        this.updateUser(user);
      }
    }
    else {
      this.messageFormMessengerError = false;
      if (user.rolUser === 'MENSAJERO' && countryConfig.isColombia) {
        if(this.form.get('courierId').value == 13 ){
          if (this.form.get('cityName')?.value !== null && this.form.get('providerName')?.value !== null && this.form.get('vehicle')?.value !== null ) {
            this.createUser(user);
          } else {
            this.loadingForm = false;
            this.messageFormMessengerError = true;
          }
        }else{
          if (this.form.get('cityName')?.value !== null&& this.form.get('vehicle')?.value !== null ) {
            this.createUser(user);
          } else {
            this.loadingForm = false;
            this.messageFormMessengerError = true;
          }
        }
        
      } else {
        this.createUser(user);
      }
    }
  }
  fieldEditable(field) {
    if(field.value != null && field.value != '') {
      field.disable();
    }
  }

  createUser(user) {

    const useServiceCourier = user.rolUser === 'MENSAJERO'  && this.useNewServiceCourier;
    
    if (useServiceCourier)  {
      user = this.validateDataToAdd(user);
    } 

    this._uS.create(user, useServiceCourier).subscribe({
      next: () => {
        user.rolName = user.rolUser;
        user.courierName = this._dS.couriers.slice(0).filter(c => String(c.id) === String(this.formControls.courierId.value))[0]?.name;
        if (this.messengers) {
          user.active = user.active ? 1 : 0;

          if (!useServiceCourier) {
            this.saveProvider(user.employeeNumber);
          }

          this.saveArmireneInfo(user.employeeNumber);
        }
        this.loadingForm = false;
        this.refresh.emit({ type: 'create', user });
        this.close.emit();
        this.toast.success('Usuario registrado correctamente');
        this.clearForm();
      },
      error: resError => {
        this.loadingForm = false;
        this.form_error = resError.error.message;
      }
    });
  }

  updateUser(user) {

    const useServiceCourier = user.rolUser === 'MENSAJERO' && this.useNewServiceCourier;
    
    if (useServiceCourier)  {
      user = this.validateDataToAdd(user);
    }

    this._uS.update(user, useServiceCourier).subscribe({
      next: () => {
        
        if (this.messengers) {
          if (!useServiceCourier) {
            this.saveProvider(user.employeeNumber);
          }

          this.saveArmireneInfo(user.employeeNumber);
        }
        countryConfig.isColombia&&this.saveUserlogs(user)
        
        this.loadingForm = false;
        this.refresh.emit({ type: 'edit', user });
        this.close.emit();
        this.toast.info('Usuario actualizado correctamente');
        this.clearForm();

      },
      error: resError => {
        this.loadingForm = false;
        if (resError.code === 'APPLICATION_ERROR') this.form_error = resError.error.message;
      }
    });
  }
  
  saveUserlogs(newObj: any) {
    var oldObj = this.user;
    var newValues = '';
    var oldValues = '';

    for (var key in oldObj) {
      if (oldObj.hasOwnProperty(key) && newObj.hasOwnProperty(key) && newObj[key]!==oldObj[key]) {
        if (newObj[key] !== '' && newObj[key] !== undefined && oldObj[key] !== newObj[key])  {
          newValues += key + '=' + newObj[key] + ', ';
          oldValues += key + '=' + oldObj[key] + ', ';
        }
      }
    }
    
    let data = {
        module: this.messengers?"4":"3",
        changes: [
        {
            newValues: newValues,
            oldValues: oldValues,
        }
        ]
    }
    this._uS.saveUserlogs(data).toPromise()
  }


  rolChange($event) {
    this.formControls.storeId.setValue(this.isShowStore($event) ? null : 0);
  }

  isShowStore(rolCahnge?: number): boolean {
    const rol = rolCahnge ?? this.formControls.rolUser.value;
    const permitidos = countryConfig.isColombia ? [3, 5, 7] : [2, 3, 5];
    return permitidos.indexOf(rol) < 0;
  }

  showExtraStores() {
    return (!this.formControls.storeId.valid || this.messengers)
      ? false : this.isShowStore() && (this.formControls.rolUser.value !== 1);
  }

  blockMessenger(deliveryName, reasonId) {
    if (this.isBloqued) {
      this.isBloqued = !this.isBloqued;
      this._uS.messengerBlock(this.user.employeeNumber, this.isBloqued);
      Swal.fire(`${deliveryName} ha sido desbloqueado correctamente`);
    }
    else {
      const employeeNumber = this._bS.getLocalUser().employeeNumber;
      this.isBloqued = !this.isBloqued;
      this._uS.messengerBlock(this.user.employeeNumber, this.isBloqued);
      this._uS.saveBlockMessenger(this.user.employeeNumber, reasonId, employeeNumber).subscribe(data => {
        Swal.fire(`${deliveryName} ha sido bloqueado correctamente`);
      })
    }
  }


  async blockReason(deliveryName) {
    if (!this.isBloqued) {
      this._dS.getBlockReasons().subscribe(async response => {
        this.reasonsResponse = response;
        const reasons = {};
        this.reasonsResponse.data.forEach(element => {
          reasons[element.id] = element.description;
        })
        const { value: reasonSelected } = await Swal.fire({
          title: `Bloquear a ${deliveryName}?`,
          input: 'select',
          inputOptions: reasons,
          inputPlaceholder: 'Razón de bloqueo',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve('');
              } else {
                resolve('Selecciona una razón de bloqueo')
              }
            })
          }
        })

        if (reasonSelected) {
          this.blockMessenger(deliveryName, reasonSelected);
        }
      });
    }
    else {
      this.blockMessenger(deliveryName, '');
    }
  }

  handleClose(removedTag: {}): void {
    this.storesTags = this.storesTags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag): string {
    const isLongTag = tag.name.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(control: any): void {
    const store = control.value;
    if (store && this.storesTags.indexOf(store) === -1) {
      this.storesTags.push(store);
    }
    control.value = '';
    this.inputVisible = false;
  }

  getDefaultStoreName() {
    return this._dS.stores.find((s) => s.id == this.formControls.storeId.value)?.name;
  }
  getStoresList(stores: any[]) {
    const st = [this.getDefaultStoreName(), ...this.storesTags];
    return stores.filter((s) => st.indexOf(s.name) < 0).map(s => s.name);
  }

  private dataUpdate() {
    this.editMode = true;
    this.formControls.employeePhone.disable();
    this.setStoreAllowed(this.user.listStoresId);
    this.formControls.employeeNumber.setValue(this.user.employeeNumber);
    this.formControls.employeeNumber.disable();
    this.formControls.documentNumber.setValue(this.user.documentNumber);
    this.formControls.storeId.setValue(this.user.storeId);
    this.formControls.employeeName.setValue(this.user.employeeName);
    if (this._uS.getLocalUser().rolUser !== 'ADMINISTRADOR' || this.messengers) this.formControls.rolUser.disable();
    this.formControls.rolUser.setValue(this.user.rolId);
    const prefix = this.user.employeePhone.substr(0, 2);
    if (prefix === countryConfig.phoneCode) {
      this.form.get('employeePhone').setValue(this.user.employeePhone.substr(2, this.user.employeePhone.length));
      this.form.get('phonePrefix').setValue(this.user.employeePhone.substr(0, 2));
    } else {
      this.form.get('employeePhone').setValue(this.user.employeePhone);
    }
    this.formControls.email.setValue(this.user.email.toLowerCase());
    this.formControls.password.setValidators([]);
    if (this.messengers && this.user.courierId) {
      this.formControls.courierId.setValue(this.user.courierId);
    }
    if (this.messengers && this.user?.vehicleName && countryConfig.isColombia) {
      let vehicleColection = this._dS?.vehiclesType.filter(vehicle => vehicle.label === this.user?.vehicleName);
      vehicleColection && this.form.patchValue({
        vehicleName: vehicleColection[0].value
      })
    }
    this.formControls.cityName.setValue(
      this._dS.cities.slice(0).filter((c) => {
        return c.value.toLowerCase() === this.user.cityName?.toLowerCase()
          || c.value.toLowerCase() === this.user.cityId?.toLowerCase()
      })[0]?.value
    );
    if (countryConfig.isVenezuela) {
      this.formControls.vehicleName?.setValue(this._dS.vehiclesType.slice(0)
        .filter(c => c.label.toLowerCase() === this.user.vehicleName?.toLowerCase())[0]?.value);
      this.formControls.active.setValue(this.user.active === 1);
      this.formControls.secondLastName.setValue(this.user.secondLastName);
      this.formControls.referredMessenger.setValue(this.user.referredMessenger);
    }
    this.formControls.providerName?.setValue(this._dS.providers.slice(0)
      .filter(c => c.label.toLowerCase() === this.user.providerName?.toLowerCase())[0]?.value);
    this.setIsArmirene();
  }

  setIsArmirene() {
    if (this.messengers) {
      if (countryConfig.isVenezuela) {
        this.activeValidators('secondLastName', [Validators.required]);
      }
      if (this.formControls.providerName.value === 11) {
        this.isArmirene = true;
        this.activeValidators('rif', [Validators.required, Validators.minLength(8)]);
        this.activeValidators('address', [Validators.required]);
        this.activeValidators('bankAccountType', [Validators.required]);    
        this.activeValidators('bankAccount', [Validators.required, Validators.minLength(20)]);
        this.activeValidators('urlRif', [Validators.required]);
        this.activeValidators('urlDocument', [Validators.required]);
        if (countryConfig.isVenezuela) {
          this.activeValidators('gender', [Validators.required]);
          this.activeValidators('birthDate', [Validators.required, legalAgeValidator()]);
          this.activeValidators('state', [Validators.required]);
          this.activeValidators('municipality', [Validators.required]);
        }
      } else {
        this.isArmirene = false;
        this.removeValidators('rif');
        this.removeValidators('address');
        this.removeValidators('bankAccountType');
        this.removeValidators('bankAccount');
        this.removeValidators('urlRif');
        this.removeValidators('urlDocument');
        if (countryConfig.isVenezuela) {
          this.removeValidators('gender');
          this.removeValidators('birthDate');
          this.removeValidators('state');
          this.removeValidators('municipality');
        }
      }
    }
  }

  private activeValidators(control: string, validators: any[]) {
    this.formControls[control].setValidators(validators);
    this.formControls[control].markAsDirty();
    this.formControls[control].updateValueAndValidity();
  }

  private removeValidators(control: string) {
    this.formControls[control].clearValidators();
    this.formControls[control].updateValueAndValidity();
  }

  private setStoreAllowed(slist: any[]) {
    this.storesTags = this._dS.stores.filter(
      (sts: any) => !!_.find(slist,
        (stg: any) => sts.id === stg
      )
    ).map(s => s.name) || [];
  }

  private getStoresAllowed() {
    return this._dS.stores.filter(
      (sts: any) => !!_.find(this.storesTags,
        (stg: any) => sts.name === stg
      )
    ).map(s => s.id) || [];
  }

  private clearForm() {
    this.form.reset();
    this.editMode = false;
    this.formControls.employeePhone.enable();
    this.formControls.courierId.setValue(0);
    this.formControls.gender.enable();
    this.formControls.birthDate.enable();
    this.form_error = undefined;
    this.loadingForm = false;
    this.filesRif = [];
    this.filesIds = [];
    this.filesPhoto = [];
    this.formControls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.formControls.employeeNumber.enable();
    this.form.get('phonePrefix').setValue(countryConfig.isColombia ? '57' : '58');
    if (this.messengers) {
      this.setValuesMessengers();
    }
  }

  private setValuesMessengers() {
    this.formControls.rolUser.setValue(this.getRolIdMessenger());
    this.formControls.rolUser.disable();
    this.formControls.storeId.setValue(0)
    this.formControls.storeId.setValidators([]);

    this.form.addControl('active', new UntypedFormControl(true));
    this._uS.messengerIsBloqued(this.user?.employeeNumber).then((res: any) => {
      this.isBloqued = res.val() == null ? false : res;
    })
    if (this.user) {
      this.form.addControl('vehicleName', new UntypedFormControl(null));
      if (countryConfig.isVenezuela) {
        this.formControls.rif.setValue(this.user.rif);
        this.formControls.address.setValue(this.user.address);
        this.formControls.bankAccount.setValue(this.user.bankAccount);
        this.formControls.hasTicketBook.setValue((this.user.hasTicketBook === 0) ? false : true);
        this.formControls.contributor.setValue((this.user.contributor === 0) ? false : true);
        this.formControls.urlRif.setValue(this.user.urlRif);
        this.formControls.urlDocument.setValue(this.user.urlDocument);
        if (this.user.urlRif) {
          this.filesRif = this.getSupportItem('Soporte Rif', this.user.urlRif);
        }
        if (this.user.urlDocument) {
          this.filesIds = this.getSupportItem('Soporte Identificación', this.user.urlDocument);
        }
        if (this.user.urlPhoto) {
          this.filesPhoto = this.getSupportItem('Foto mensajero', this.user.urlPhoto);
        }
        if (this.user.providerName === "Armirene") {
          this.formControls.bankAccountType.setValue(this.user.bankAccountType);
          this.formControls.state.setValue(this.user.state);
          this.formControls.municipality.setValue(this.user.municipality);
          if(this.user?.gender){
            this.formControls.gender.setValue(this.user?.gender);
            this.formControls.gender.disable();
          }else{
            this.formControls.gender.enable()
          }
          if (this.user?.birthDate) {
            this.formControls.birthDate.setValue(new Date(`${this.user?.birthDate}T00:00`));
            this.formControls.birthDate.disable();
          }else{
            this.formControls.birthDate.enable()
          }
        }
      }
    } else {
      this.form.addControl('providerName', new UntypedFormControl(null));
      this.form.addControl('cityName', new UntypedFormControl(null));
      this.formControls.courierId.setValidators([Validators.required]);
      this.formControls.courierId.setValue(null);
      if (countryConfig.isVenezuela) {
        this.form.addControl('vehicleName', new UntypedFormControl(null));
      }
    }
  }

  private getSupportItem(name, file) {
    return [{ uid: '-1', name, status: 'done', url: file, thumbUrl: file }];
  }
  private saveProvider(messengerId) {
    this._uS.saveMessengerByProvider(messengerId, this.formControls.cityName.value, this.form.get('vehicleName').value, this.formControls.providerName?.value, this.formControls.urlPhoto?.value)
      .subscribe({ error: (error) => { this.toast.error(error) } });
  }

  saveArmireneInfo(messengerId) {
    if (this.formControls.providerName.value === 11) {
      let data: any = {
        messengerId,
        rif: this.formControls.rif.value,
        address: this.formControls.address.value,
        bankAccount: this.formControls.bankAccount.value,
        hasTicketBook: !this.formControls.hasTicketBook.value ? 0 : 1,
        contributor: !this.formControls.contributor.value ? 0 : 1,
        urlRif: this.formControls.urlRif.value,
        urlDocument: this.formControls.urlDocument.value,
        state: this.formControls.state.value,
        municipality: this.formControls.municipality.value,
        bankAccountType: this.formControls.bankAccountType.value,
      };
      if (countryConfig.isVenezuela) {
        data = {
          ...data,
          birthDate: this.formControls?.birthDate?.value?.toJSON()?.slice(0, 10),
          gender: this.formControls?.gender?.value,
        };
      }
      this._uS.saveArmireneInfo(data).subscribe({});
    }
  }


  private getRols() {
    this._uS.getRols().subscribe({
      next: (rta: any) => {
        if (!this.messengers) this.rols = rta.data.filter(rol => rol.name !== 'MENSAJERO');
        else {
          this.rols = rta.data.filter(rol => rol.name === 'MENSAJERO');
          this.formControls.rolUser.disable()
          this.formControls.rolUser.setValue(this.getRolIdMessenger())
        }
      }
    });
  }

  showMessengerVzla() {
    return countryConfig.isVenezuela && this.messengers;
  }

  get isAdmin() {
    return (this._uS.getLocalUser().rolUser == 'ADMINISTRADOR');
  }
  canAddStore() { return this.isAdmin; }

  private getRolIdMessenger() {
    const index = this.rols.slice(0).findIndex(rol => rol.name === 'MENSAJERO');
    return index !== -1 ? this.rols[index].id : 8;
  }

  private getUsers() {
    this._uS.getUsers().subscribe({
      next: (rta: any) => { this.messengerList = rta.data.filter(user => user.rolName == 'MENSAJERO'); },
      error: error => { this.messengerList = [] }
    });
  }

  hasBlocked() {
    return this.isBloqued && this.user.blockDescription;
  }

  getUploadFileUrl() { return this._dS.upload + '/upload'; }



  handleChange(data, control: string) {

    if (data.type === "success") {
      const source = data.fileList[0]?.response.link
      this.formControls[control].setValue(source);
    }
    else if (data.type === "removed") {
      this.formControls[control].setValue(null);
      this.formControls[control].updateValueAndValidity();
    }
  }

  checkboxContributor(e) {
    this.form.patchValue({
      'contributor': !this.formControls.contributor.value ? 0 : 1,
    })
  }

  disabledDate (current: Date): boolean {
    return now.diff(moment(current), 'years') < 18;
  }

  validateDataToAdd (user) {
    const defaultIdProvider = 1;
    const dataProvider = {
      cityId: user.cityName,
      messengerId: user.employeeNumber,
      messengerProviderId: user.providerName || defaultIdProvider,
      vehicleTypeId: user.vehicleName
    }
    return {...user, ...dataProvider}
  }
}

function legalAgeValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    if(!countryConfig.isVenezuela || !control.value) return null;
    const currentYear = new Date().getFullYear();
    const dateYear = new Date(control.value).getFullYear();
    const isLegalAge = (currentYear -dateYear) >= 18;
    return !isLegalAge ? {legalAge: true} : null;
  }
}