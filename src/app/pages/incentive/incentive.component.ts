import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { DefaultIncentive, IncentiveBy, IncentiveTypes } from 'src/app/core/models/incentive.class';
import { IncentiveService } from 'src/app/services/incentive.service';
import { countryConfig } from 'src/country-config/country-config';
import Swal from 'sweetalert2';
import { IncentiveFormComponent } from './incentive-form/incentive-form.component';

@Component({
    selector: 'app-incentive',
    templateUrl: './incentive.component.html',
    styleUrls: ['./incentive.component.scss']
})

export class IncentiveComponent implements OnInit {

    loadingData = false;
    incentives:any;
    listOfData = [];
    selectedItemList = [];
    selectList = [];
    filterType = IncentiveTypes[0];
    incentiveTypes = [...IncentiveTypes];
    @ViewChild(IncentiveFormComponent) incentiveForm: IncentiveFormComponent;

    get defaultValues() : DefaultIncentive {
        return this.incentives?.incentive;
    }

    constructor( private _iS: IncentiveService ) { }

    ngOnInit() { this.loadData(); }

    getCityName(cityId: string) {
        const cityName = this._iS.cities.filter((c) => c.value == cityId);
        return (cityName?.length > 0) ? cityName[0].label : 'NA';
    }
    
    getStoreName(store: any) {
        const storeName = this._iS.stores.filter((c) => c.id == store.storeId);
        if(storeName?.length > 0) {
            return {
                cityId: this.getCityName(storeName[0].city),
                storeId: storeName[0].name
            }
        } 
        else return { cityId: 'NA', storeId: 'NA' };
    }

    getCourierName(courierId: number) {
        const courierName = this._iS.couriers.filter((c) => c.id == courierId);
        return (courierName?.length > 0) ? courierName[0].name : 'NA';
    }

    getDataKm(km: number) {
        const searchKm = this._iS.incentiveByKm.filter((dataIncentiveKm) => dataIncentiveKm.value == km);
        const kmValue = (searchKm?.length > 0) ? searchKm[0].value : 'NA';
        return kmValue;
    }
    
    getFormatPrice(price: number): string {
        return this._iS.getFormatPrice(price);
    }

    loadData() {
        this.loadingData = true;
        this._iS.getIncentives().subscribe((data) =>{
            this.incentives = {
                incentive: data.incentive,
                incentiveByCity: data.incentiveByCity || [],
                incentiveByStore: data.incentiveByStore || [],
                incentiveByCourier: data.incentiveByCourier || [],
                incentiveByKm: data.incentiveByKm || []
            };
            this.changeType();
            this.loadingData = false;
        },() => {
            this.loadingData = false;
            Swal.fire('¡Error al eliminar cargar los datos!','','error');
        });
    }

    changeType() {
        this.loadingData = false;
        const lst = this._iS[this.filterType.service];
        this.filterType.service !== 'incentiveByKm' ?
            this.selectList = lst.map(
                listIncentive =>{
                    return{text:listIncentive.name,value:listIncentive.name, eq: listIncentive[this.filterType.key]};
            })
         :
         this.selectList = lst.map(
            listIncentive =>{
            return{text:listIncentive, value:listIncentive, eq: listIncentive};
         });
         this.changeList([]);
    }
    
    changeList(itemlist: any[] = []) {
        let list: any[] = [];
        this.listOfData = [];
        if(itemlist.length > 0) {
            for (let index = 0; index < this.incentives[this.filterType.value].length; index++) {
                const item = this.incentives[this.filterType.value][index];
                const text = item.cityId || item.storeId || item.courierId || parseInt(item.km);
                if(itemlist.filter(i => i.eq == text).length > 0) {
                    list.push({...item, oid: index });
                }
            }
        } else {
            if(!!this.incentives){
                list = this.incentives[this.filterType.value]
                    .map( (item, index) => { return {...item, oid: index }; });
            }
        }
        this.listOfData = list.map((i,n) => this.appendInfo(i,n));
    }

    appendInfo(item, index) {
        const seed = {...item, oid: index };
        if(item.courierId){
            seed.courierName = !!item.courierId ? this.getCourierName(seed.courierId) : 'N/A';
        }
        else if(item.cityId) {
            seed.cityName = !!item.cityId ? this.getCityName(item.cityId) : 'N/A';
        } 
        else if(item.storeId) {
            const storeInfo = this.getStoreName(item);
            seed.cityName = storeInfo?.cityId || 'N/A';
            seed.storeName= storeInfo?.storeId || 'N/A';
        }else if(item.km){
            seed.kmName = item.km;
            seed.kmName = !!item.km? this.getDataKm(item.km) : 'N/A';
        } 
        return seed;
    }

    edit(incentive: any) {
        this.incentiveForm.setIncentive(
            incentive,
            this.filterType
        );
    }
    
    remove(data){
        console.log(data)
        const text = data.cityId || data.storeName || data.courierName || data.kmName;
        const msg = `Incentivo para ${text} de $ ${data.value}`;
        Swal.fire({
            title: 'Eliminar',
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminarlo!'
          }).then((result) => {
            if (result.isConfirmed) {
                let arrayNew =[];
                this.incentives[this.filterType.value].filter((o,i)=>(i===data.oid) ? null : arrayNew.push(o));
                this.updateRemoteData(
                    this.filterType.value, 
                    arrayNew
                ).subscribe({
                    next: (resp : any) => {
                        if(resp?.code === 'OK'){
                            Swal.fire('¡Incentivo eliminado!','','success');
                        }else{
                            Swal.fire(resp.message,'','error');  
                        }
                    },
                    error: () => {
                        Swal.fire('¡Error al eliminar incentivo!','intente mas tarde','error')
                        .then(()=>this.loadData());
                    }
                });
            }
          })
    }
    
    update({data, incentiveLog}) {
        let arrayNew =[];
        const db: any[] = this.incentives[data.type];
        let typeIncentive =  {[data.tpid] : data?.list[0]};
        let valueIncentive: IncentiveBy = {
            value: data?.base?.value,
            incentiveStartDate: data?.base?.incentiveStartDate,
            incentiveEndDate: data?.base?.incentiveEndDate,
            valueMin: data?.base?.valueMin,
            valueMax: data?.base?.valueMax,
            ...typeIncentive
        }
        if(!data.edit) {
            for (let element of data.list) {
                // if(countryConfig.isVenezuela) {
                //     let reg: any[] = db.filter((ojb) => {
                //         return ojb[data.tpid] === element
                //     });
                //     if(reg?.length>0) {
                //         reg[0] = {...reg[0], ...data.base};
                //     } else {
                //         let newreg: any = {...data.base};
                //         newreg[data.tpid] = element;
                //         db.push(newreg);
                //     }
                // } else {
                    let newreg: any = {...data.base};
                    newreg[data.tpid] = element;
                    db.push(newreg);
                // }
            }
        } else {
            let response = db.filter((o,i)=>(i===data.oid) ? arrayNew.push(valueIncentive) : arrayNew.push(o));
        }

        let dataValidate = {
            "incentiveByStore": data.type === 'incentiveByStore' ? [valueIncentive] : [],
            "incentiveByCourier": data.type === 'incentiveByCourier' ? [valueIncentive] : [],
            "incentiveByCity": data.type === 'incentiveByCity' ? [valueIncentive] : []
        }
        if (countryConfig.isColombia) {
            this._iS.validateIncentives(dataValidate, (data.edit ? 'EDIT' : 'CREATE')).subscribe({
                next: (response: any) => {
                    if (response?.message === 'success') {
                        if(data.edit){
                            this.updateDataService(data, arrayNew, incentiveLog);
                        }else{
                            this.updateDataService(data, db, incentiveLog);
                        }
                    }
                },
                error: (error) => {
                    Swal.fire('', error?.error?.message, 'error')
                        .then(() => this.loadData());
                }
            });
        } else {
              if(data.edit){
                this.updateDataService(data, arrayNew, incentiveLog);
            }else{
                this.updateDataService(data, db, incentiveLog);
            }
        }

    }

    updateDataService(data: any, arrayNew, incentiveLog) {
            this.updateRemoteData(data.type, arrayNew)
            .subscribe({
                next: (resp) => {
                    this.incentiveForm.modalToogle(false);
                    if (incentiveLog) this._iS.setIncentiveModuleLog(incentiveLog)
                        .subscribe({
                            next: res => { },
                            error: err => {
                                Swal.fire('¡Error al guardar log de incentivo!', 'intente mas tarde', 'error')
                                    .then(() => this.loadData());
                            },
                        });
                },
                error: () => {
                    Swal.fire('¡Error al actualizar incentivo!', 'intente mas tarde', 'error')
                        .then(() => this.loadData());
                }
            }
            );
    }

    updateRemoteData(index, data) {
        this.incentives[index] = [...data];
        this.changeList([]);
        return this._iS.setIncentives(this.incentives).pipe(first());
    }
}