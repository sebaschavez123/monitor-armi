import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-form-aware',
  templateUrl: './form-aware.component.html',
  styleUrls: ['./form-aware.component.scss']
})
export class FormAwareComponent implements OnInit {
 @Input() dataOrder: any;
 @Input() typeUser: any;
 @Input() send:any;
 @Input() messageCall: string;
 @Input() dial_id: string;
 @Output() closeModal = new EventEmitter();
 dataAware: UntypedFormGroup;
 dataArea;
 typificationOptions = [];
 typificationOptionTwo = [];
 typificationOptionThree = [];
 typificationOptionFour = [];
 typificationOptionFive = [];
 valueOption: number;
 messageResponse: string;
 typificationSelected:number;


  constructor(private fb: UntypedFormBuilder,
              private _oS:OrderService,
              private toastr:ToastrService,) { 
                this.formBuilder();
              }

  ngOnInit() {
    this.consultId(this.typeUser, 'init');
    this.consultAreas();
    this.formValues(this.dataOrder);
  }

  formBuilder(){
    this.dataAware = this.fb.group({
      orderId : '',
      documentNumber : '',
      orderStatus : '',
      city : '',
      operator : '',
      shop : '',
      managementArea: '',
      typification: '',
      newField:'',
      newTwoField:'',
      newThreeField:'',
      newFourField:'',
      newFiveField:'',
      observation:['', Validators.required],
    });
  }

  formValues(data){
    this.dataAware.patchValue({
      orderId: data?.orderId,
      documentNumber: data?.customerDocument,
      orderStatus: data?.status,
      city: data?.city?.toUpperCase(),
      operator: data?.courierName?.toUpperCase(),
      shop: data?.storeName?.toUpperCase(),   
   }); 

  }
  
  consultId(id, textArray){    
  this._oS.getTypicationCallAwaure(id).subscribe( (res:any)=>{
   switch (textArray) {
     case 'typificationOptions':
      this.dataAware.patchValue({
        newField:'',
        newTwoField:'',
        newThreeField:'',
        newFourField:'',
        newFiveField:'',
      })
      this.typificationOptionTwo= [];
      this.typificationOptionThree= [];
      this.typificationOptionFour= [];
      this.typificationOptionFive= [];
      this.typificationOptionTwo = res?.data;
      break;
     case 'typificationOptionTwo':
      this.dataAware.patchValue({
        newTwoField:'',
        newThreeField:'',
        newFourField:'',
        newFiveField:'',
      })
      this.typificationOptionThree= [];
      this.typificationOptionFour= [];
      this.typificationOptionFive= [];
      this.typificationOptionThree = res?.data; 
      break;
     case 'typificationOptionThree':
      this.dataAware.patchValue({
        newThreeField:'',
        newFourField:'',
        newFiveField:'',
      })
      this.typificationOptionFour= [];
      this.typificationOptionFive= [];
      this.typificationOptionFour = res?.data;
      break;
     case 'typificationOptionFour':
      this.dataAware.patchValue({
        newFiveField:'',
      })
      this.typificationOptionFive= [];
      this.typificationOptionFive = res?.data;
      break;
     case 'init':
      this.dataAware.patchValue({
        newField:'',
        newTwoField:'',
        newThreeField:'',
        newFourField:'',
        newFiveField:'',
      })
      this.typificationOptions = [];
      this.typificationOptionTwo= [];
      this.typificationOptionThree= [];
      this.typificationOptionFour= [];
      this.typificationOptionFive= [];
      this.typificationOptions = res?.data;
      break;
   }
  });
  }

  consultAreas(){
    this._oS.getParamasAreaAwaure().subscribe( (res:any)=>{
      this.dataArea = res?.data;
    });
  }

  sendId(nameField, arrayTifications?, textArray?){       
    if(nameField !== 'managementArea'){
      let valueTipi = this.dataAware.get(nameField).value;   
      let itemSelect = arrayTifications.filter(item => item?.typification === valueTipi);   
         if(itemSelect[0]?.id){
           this.typificationSelected =  itemSelect[0]?.id;
           this.consultId(itemSelect[0]?.id, textArray);
         }
    }
  }

  sendForm(){   
    // console.log('ingrese a enviar el formulario', this.dataAware.valid); 
    if(this.dataAware.valid){
      let data = 
        {
          "orderId" : this.dataAware.get('orderId').value,
          "documentNumber": this.dataAware.get('documentNumber').value,
          "city" : this.dataAware.get('city').value,
          "observation": this.dataAware.get('observation').value,
          "typificationId": this.typificationSelected,
          "dial_id" : this.dial_id,
          "managementArea": this.dataAware.get('managementArea').value
         }
        this._oS.sendFormAwaure(data).subscribe({
          next: (res) => {
            if(res){
             this.toastr.success('Formulario enviado correctamente');
             setTimeout(() => {
               this.closeModal.emit(true);
               this.dataAware.reset();
              }, 2000);
            }
          },
          error: (e) => this.toastr.error(e?.message),
        }
        )
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.send?.currentValue === true){
      this.sendForm();
    }
    if(changes?.dial_id?.currentValue){
      this.dial_id =  changes?.dial_id?.currentValue;
    }
  }  

}
