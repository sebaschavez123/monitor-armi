import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/interfaces';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user:User;
  thisProfile:boolean = false;
  visibiltyPass = { new: false, old:false}
  form:UntypedFormGroup;
  form_error:string;
  loadingForm:boolean = false;


  constructor(private _uS:UserService,
              private toast:ToastrService,
              private activatedRoute: ActivatedRoute) {
    this.form = new UntypedFormGroup({
      'old': new UntypedFormControl(null, Validators.required),
      'new': new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params.id;
    if(id == this._uS.getLocalUser().employeeNumber) this.thisProfile = true;
    this._uS.getUsers().subscribe((rta:any) => {
      this.user = rta.data.filter(user => user.employeeNumber == id)[0];
    },
    error => {});
  }
  get f(){ return this.form.controls; }

  changePassword(){
      this.loadingForm = false;
      this._uS.cambiarContrasena(this.f['new'].value, this.f['old'].value).subscribe(
      (rta:any) => { 
        this.loadingForm = false;
          if(rta.data.message !== "Password Anterior Errado"){
            this.form.reset();
            this.toast.success("Se actualizo la contraseña correctamente");
          }else{
            this.form_error = rta.data.message; 
          }
      },error => {
        this.loadingForm = false;
        this.toast.error("No se actualizó la contraseña , por favor verifique");
      });
  }

}
