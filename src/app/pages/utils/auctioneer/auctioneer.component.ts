import { AfterViewInit, Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuctioneerService } from 'src/app/services/auctioneer.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-auctionner',
    templateUrl: './auctioneer.component.html',
    styleUrls: ['./auctioneer.component.scss']
})

export class AuctioneerComponent implements AfterViewInit {

    db = null;
    isLoading = false;
    isPending = false;
    loadingData = false;
    delayList = [];
    storesList = [];
    listOfData = [];
    selectedCity: string = null;
    selectedStore:any = {};
    currierList: any [] = [];
    ndata: any = {
        "courierId": null,
        "shippingOrder": null,
        "delay": 30,
        "active": false
    } 
    
    get citiesList() { return this._aS.cities; }
    
    constructor(
        private _aS: AuctioneerService,
        private toastr:ToastrService
    ){
        this.getMonitorAuctioneerValues();
        this.loadData();
    }

    ngAfterViewInit() {
        this.currierList = this._aS.couriers.map((c) => {
            return {value: c.id, label: c.name}
        });
    }

    getMonitorAuctioneerValues () {
        firstValueFrom(this._aS.getMonitorAuctioneerValues())
        .then((resp)=>{
            this.delayList = resp;
            this.ndata.delay = resp[0];
        });

    }

    getDelayValues(delay: number) {
        if (this.delayList.findIndex(e => e == delay) < 0) {
            this.delayList.push(delay);
        }
        return this.delayList
    }

    loadData() {
        console.clear();
        this.loadingData = true;
        firstValueFrom(this._aS.getData())
        .then((resp)=>{
            this.loadingData = false;
            this.db = resp;
        });
    }

    updateCity(cityId) {
        this.selectedStore = undefined;
        this.storesList = this._aS.stores.filter((s)=> s.city === cityId);
    }

    updateStore(storeId) {     
        this.listOfData = [];
        let city = this.db.cityConfigs.find((c) => c?.cityId === this.selectedCity);
        if(city) {
            let store = city.storeConfigs.find((s) => s.storeId === storeId);
            if(store) this.setListOfData(store.courierConfigs);
        }
    }

    currierName(id) {return this._aS.getCourierName(id) || 'N/A';}

    setListOfData(list: any[]){
        this.listOfData = list.map((item) => {
            return {
                ...item,
                currierName: this.currierName(item.courierId),
                optionsDelay: this.getDelayValues(item.delay)
            }
        });
        
    }

    drop(event: CdkDragDrop<string[]>): void {
        if(event.previousIndex != event.currentIndex) {
            let tmpArray = [...this.listOfData]
            tmpArray[event.previousIndex].pending = true;
            moveItemInArray(tmpArray, event.previousIndex, event.currentIndex);
            this.setListOfData(tmpArray);
            this.updateData();
        }
    }

    update(data) {
        data.pending = true;
        this.updateData();
    }

    addReg(){
        if(!this.ndata.courierId) {
            this.ndata.error = true;
        } else {            
            this.ndata.pending = true;
            this.updateData(true);
        }
    }
    showNewReg() {
        return this.selectedStore >= 0;
    }
    
    updateData(add = false) {
        this.isLoading = true;
        let newDb = {...this.db};
        let couriers = [...this.listOfData].map((dataCourier, position)=>{
            if(dataCourier?.shippingOrder[position] === dataCourier?.shippingOrder[position + 1]) {
                return { courierId: dataCourier.courierId, shippingOrder: position+1 ,
                    delay: dataCourier.delay, active: dataCourier.active,
                };
            }else{
                return { courierId: dataCourier.courierId, shippingOrder: dataCourier?.shippingOrder ,
                    delay: dataCourier.delay, active: dataCourier.active,
                };
            }
        });
        newDb.cityConfigs = [...newDb.cityConfigs];
        // TODO para agregar una opcion más
        if(add) {
            couriers.push({
                courierId: this.ndata.courierId,
                shippingOrder: couriers.length + 1,
                delay: this.ndata.delay,
                active: this.ndata.active
            });
        }
        let dbCityId = newDb.cityConfigs.findIndex((c) => c?.cityId === this.selectedCity);
        if(dbCityId == -1) {
            newDb.cityConfigs.push({
                cityId: this.selectedCity,
                active:true,
                storeConfigs:[{
                    storeId: this.selectedStore,
                    active: true,
                    courierConfigs: [...couriers]
                }]
            });
        } else {
            let dbCity = {
                cityId: newDb.cityConfigs[dbCityId].cityId,
                active: true,
                storeConfigs: [...newDb.cityConfigs[dbCityId].storeConfigs]
            };
            
            let dbStoreId = dbCity.storeConfigs.findIndex((s) => s.storeId === this.selectedStore);
            if(dbStoreId == -1) {
                dbCity.storeConfigs.push({
                    storeId: this.selectedStore,
                    active: true,
                    courierConfigs: [...couriers]
                });
            } else {
                dbCity.storeConfigs[dbStoreId]
                .courierConfigs = [...couriers];
            }
            newDb.cityConfigs[dbCityId] = dbCity;
        }
        
        this._aS.setData(newDb).subscribe({
            next: () => {
                this.isPending = false;
                this.isLoading = false
                this.db = {...newDb};
                this.setListOfData(couriers);
                if(add) {this.clearNewReg();}
            },
            error: (err) => {
                this.isPending = true;
                this.isLoading = false;
                this.toastr.error('No se ha podigo actualizar la información','Ooops!!',{timeOut: 2500});
            }
        });
    }

    clearNewReg(){
        this.ndata = {
            "courierId": null,
            "shippingOrder": 0,
            "delay": this.delayList[0],
            "active": false
        };
    }

}