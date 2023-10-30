import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Address, Customer } from '../../../core/interfaces';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { countryConfig } from 'src/country-config/country-config';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'
import { firstValueFrom } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnChanges {

  @Input() customer: Customer;
  @Input() customerId: string;
  @Input() pageMode = false;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();


  form: UntypedFormGroup;
  formError: string;
  loadingForm = false;
  editMode = true;
  addressSelected: Address;
  lifemile = [];
  address: Array<any> = [];
  blockedMessage;
  openDetails = false;

  get lastSubscription() {
    return this.customer.primeSusbcriptionDomain 
      ? this.customer.primeSusbcriptionDomain[0]
      : null;
  }

  constructor(private _cS: CustomerService,
    private _uS: UserService,
    private toast: ToastrService) {
    this.form = new UntypedFormGroup({
      firstname: new UntypedFormControl(null, Validators.required),
      lastname: new UntypedFormControl(null, Validators.required),
      id: new UntypedFormControl(null, Validators.required),
      documentNumber: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      phone: new UntypedFormControl(null, [Validators.required, Validators.minLength(10)]),
      phonePrefix: new UntypedFormControl(countryConfig.isColombia ? '57' : '58', Validators.required),
      addresses: new UntypedFormControl([]),
      lifemile: new UntypedFormControl([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.hasBlocked()
    if (changes.customer) {
      if (!this.customer) {
        this.clearForm();
        return;
      }
      this.dataUpdate()
    }
  }

  get isVenezuela() { return countryConfig.isVenezuela; }

  get f() {
    return this.form.controls;
  }

  isAdmin() {
    return (this._uS.getLocalUser().rolUser == 'ADMINISTRADOR');
  }

  selectAddress(address: any) {
    this.addressSelected = address;
  }

  refreshAddress(address: Address) {
    this.customer.addresses.splice(
      this.customer.addresses.findIndex(ad => ad.idAddress == address.idAddress),
      1,
      address
    );
  }

  getPrimeType(typeSubscription: string): string {
    const typeSubscriptionOptions = {
      'MONTH': 'Mensual',
      'YEAR': 'Anual',
      'SEMESTER': 'Semestral'
    }
    return typeSubscriptionOptions[typeSubscription] || 'No se encontró tipo de suscripción';
  }

  canEdit() {
    return this._cS.getLocalUser().canModifyClients == 1;
  }

  action() {
    this.loadingForm = true;
    const form = this.form.value;
    form.phone = form.phonePrefix + form.phone;
    const customer: Customer = this.form.value;
    const promises = [
      // this._cS.setLifemile(this.customer.id, this.form.get('lifemile').value).toPromise(),
      this._cS.update(customer, this.customer.id).toPromise(),
      customer.addresses.map(adr => { return this._cS.setCustomerAddressStatus(adr.idAddress, adr.active).toPromise(); })
    ];
    Promise.all(promises).then((res) => {
      this.loadingForm = false;
      this.close.emit({type:'edit', customer: form});
      countryConfig.isColombia&&this.saveCustomerlogs(customer)
      this.toast.info('Usuario actualizado correctamente');
       this.clearForm();
    })
      .catch(error => { this.loadingForm = false; })
  }

  blockUser() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea bloquear el usuario?',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Escribe la razón por la cual se va a bloquear el usuario...',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      cancelButtonText: 'Cancelar',
      preConfirm: (reason) => {
        if (!reason || reason === '') {
          Swal.showValidationMessage(`Por favor ingrese la observación`)
        } else {
          return Promise.all([
            this._cS.blockData(2, this.customer.phone),
            firstValueFrom(this._uS.blockUser(this.customer.id, reason))
          ]).then((res: any) => {
            return res;
          }, error => {
            Swal.showValidationMessage(`Error en servicio, Vuelve a intentarlo`);
          })
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res: any) => {
      if (res.value && res.value[1]) {
        this.customer.blocked = res.value[1].confirmation;
      }
    })

  }

  unblockUser() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea desbloquear el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return Promise.all([
          this._cS.unBlockClient(this.customer.id),
          firstValueFrom(this._uS.unblockUser(this.customer.id))
        ]).then((res: any) => {
          return res;
        }, error => {
          Swal.showValidationMessage(`Error en servicio, Vuelve a intentarlo`);
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((res: any) => {
      if (res.value && res.value[1]) {
        this.customer.blocked = (res.value[1].confirmation ? false : true);
      }
    })
  }

  private dataUpdate() {
    this.form.get('id').setValue(this.customer.id);
    this.form.get('firstname').setValue(this.customer.firstname ?? this.customer['firstName']);
    this.form.get('lastname').setValue(this.customer.lastname ?? this.customer['lastName']);
    this.form.get('documentNumber').setValue(this.customer.documentNumber);
    this.form.get('phone').setValue(this.customer.phone.substr(2, this.customer.phone.length));
    this.form.get('phonePrefix').setValue(this.customer.phone.substr(0, 2));
    this.form.get('email').setValue(this.customer.email);
    this.form.get('addresses').setValue(this.customer.addresses);
    this.address = this.customer.addresses;
    this._cS.getLifemiles(this.customer.id).subscribe((res: any) => {
      this.lifemile = res.data;
      this.customer.lifemiles = this.lifemile.map(lm => { return lm.status });
    });
    this._uS.verify(this.customer.id).subscribe((rta: any) => { this.customer.blocked = rta.confirmation; }, error => { });
  }

  private clearForm() {
    this.form.reset();
    this.f.addresses.setValue([]);
    this.f.lifemile.setValue([]);
    this.f.phonePrefix.setValue(countryConfig.isColombia ? '57' : '58');
    this.lifemile = [];
    this.address = [];
    this.addressSelected = undefined;
  }
  hasBlocked() {
    if (this.customer) {
      const customerId = this.customer.id.toString()
      this._cS.isBlocked(customerId).subscribe((res: any) => {
        if (res.confirmation && res.message)  this.blockedMessage = res.message;
      })
    }

  }

  saveCustomerlogs(newObj: any) {
    var oldObj = this.customer;
    var newValues = '';
    var oldValues = '';

    for (var key in oldObj) {
      if (oldObj.hasOwnProperty(key) && oldObj[key] !== newObj[key] && newObj[key] !== 'undefined') {
        if (newObj[key] !== '' && newObj[key] !== undefined && oldObj[key] !== newObj[key]) {
          newValues += key + '=' + newObj[key] + ', ';
          oldValues += key + '=' + oldObj[key] + ', ';
        }
      }
    }

    let data = {
        module: "2",
        changes: [
        {
            newValues: newValues,
            oldValues: oldValues,
        }
        ]
    }
    this._uS.saveUserlogs(data).toPromise();
  }
}
