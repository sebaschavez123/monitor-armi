import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

const headers = [
    {
        header: 'Tienda',
        name: 'store',
        sortOrder: null,
        fullsize: false,
        hdrStore: true,
        sortFn: (a: any, b: any) => String(a.store).localeCompare(String(b.store)),
    },
    {
        header: 'Ciudad',
        name: 'city',
        sortOrder: null,
        fullsize: false,
        sortFn: (a: any, b: any) => String(a.city).localeCompare(String(b.city)),
    },
    {
        header: 'Enviada',
        name: 'sentOrders',
        sortOrder: null,
        fullsize: false,
        sortFn: (a:any,b:any) => Number(a.sentOrders) - Number(b.sentOrders)
    },
    {
        header: 'Asignada',
        name: 'assignedOrders',
        sortOrder: null,
        fullsize: false,
        sortFn: (a:any,b:any) => Number(a.assignedOrders) - Number(b.assignedOrders)
    },
    {
        header: 'Picking',
        name: 'pickingOrders',
        sortOrder: null,
        fullsize: true,
        sortFn: (a:any,b:any) => Number(a.pickingOrders) - Number(b.pickingOrders)
    },
    {
        header: 'Facturada',
        name: 'billedOrders',
        sortOrder: null,
        fullsize: true,
        sortFn: (a:any,b:any) => Number(a.billedOrders) - Number(b.billedOrders)
    },
    {
        header: 'Entregada',
        name: 'deliveredOrders',
        fullsize: true,
        sortOrder: null,
        sortFn: (a:any,b:any) => Number(a.deliveredOrders) - Number(b.deliveredOrders)
    },
    {
        header: 'Total',
        name: 'total',
        fullsize: false,
        sortOrder: null,
        sortFn: (a:any,b:any) => Number(a.total) - Number(b.total)
    },
    {
        header: 'Pendientes',
        name: 'percentage',
        fullsize: false,
        sortOrder: null,
        sortFn: (a:any,b:any) => Number(a.percentage) - Number(b.percentage)
    }
]

@Component({
    selector: 'app-glued',
    templateUrl: './glued.component.html',
    styleUrls: ['./glued.component.scss']
})

export class GluedComponent implements OnInit {

    isLoading = false;
    data = <any>[];
    alldata = <any>[];
    storesList: any[] = null;
    citiesList: any[] = null;
    @Input() orderType: string; 
    @Input() fullsize: Boolean = true;
    @Output() changeSize: EventEmitter<boolean> = new EventEmitter();
    @Input() set filters(dta: any) {
        if(dta?.length > 0) {
            this.citiesList = dta.filter((obj) => obj.key == 'cityId' )
                .map(city => city.value?.toLowerCase());
            this.storesList = dta.filter((obj) => obj.key == 'storeId')
                .map(store => store.value?.toLowerCase());
        }
        else {
            this.storesList = [];
            this.citiesList = [];
        }
        this.getData();
    }

    get hdrs() {return headers; };
    
    constructor(
        private _dS: DashboardService
    ) { }

    ngOnInit() {
        this.getData();
    }

    get filterMode() : boolean {
        return this.storesList.length>0 || this.citiesList.length>0;
    }

    getData() {
        if(!this.orderType){ return false;}
        this.isLoading = true;
        if(this.filterMode) {
            this.updateStores();
            return;
        }
        else {
            this._dS.getQueueCities(this.orderType).subscribe({
                next: (rta:any) => {  this.alldata = rta; },
                error: () => {},
                complete:() => { this.isLoading = false; }            
              });

        }
    }
    updateStores() {
        this._dS.getQueueStores(this.orderType).subscribe({
            next: (rta:any) => { 
                const data = rta;
                if(this.citiesList?.length>0) {
                    this.alldata = data.filter(
                        (seleted) => this.citiesList.findIndex(city => city === seleted.city.toLowerCase()) > -1
                    );
                    if(this.storesList?.length > 0) {
                        this.alldata = this.alldata.filter(
                            (seleted) => this.storesList.findIndex(store => store === seleted.store.toLowerCase()) > -1
                        );
                    }
                } else {
                    this.alldata = data.filter(
                        (seleted) => this.storesList.findIndex(store => store === seleted.store.toLowerCase()) > -1
                    );
                }
            },
            error: () => {},
            complete:() => { this.isLoading = false; }            
        });
    }
    
    showButton() {
        return !this.fullsize && this.alldata.length > 5;
    }

    changeToFullsize() {
        this.changeSize.emit(true);
    }

    getColorGb(percent) {
        return (percent >= 0 && percent < 20)
            ? 'color-green'
            : (percent >= 20 && percent < 30)
                ? 'color-yellow'
                : (percent >= 30 && percent < 40)
                    ? 'color-orange'
                    :  'color-red';
    }
}