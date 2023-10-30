import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FilterComponent } from 'src/app/components/general/orders-table/filter/filter.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-stock',
    templateUrl: './utils-stock.component.html',
    styleUrls: ['./utils-stock.component.scss']
})

export class UtilsStockComponent implements OnInit, AfterViewInit {
    
    isLoading = false;
    storesList = [];
    allCities = [];
    citiesList = [];
    stockList = [];
    listOfColumn = [
        {
            title: 'Ciudad',
            compare: (a, b) => a.cityName.localeCompare(b.cityName),
            priority: false,
            align: ''
        },
        {
            title: 'Tienda',
            compare: (a, b) => a.storeName.localeCompare(b.storeName),
            priority: false,
            align: ''
        },
        {
            title: 'Stock',
            compare: (a, b) => a.stock - b.stock,
            priority: false,
            align: 'center'
        },
    ];

    validateForm!: UntypedFormGroup;
    controlArray: Array<{ index: number; show: boolean }> = [];
    isCollapse = true;

    selecteds = {
        city: 'ALL',
        stores: [],
        sku: null
    }

    @ViewChild(FilterComponent) inputStores: FilterComponent;
    
    constructor(
        private fb: UntypedFormBuilder,
        private _uS: UtilsService
    ) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({});
        for (let i = 0; i < 10; i++) {
            this.controlArray.push({ index: i, show: i < 6 });
            this.validateForm.addControl(`field${i}`, new UntypedFormControl());
        }
        this.allCities = this._uS.cities.map(
            (c) => { return {text: this.getLabelCity(c.label), value: c.value}; }
        );
    }
    
    ngAfterViewInit() {
        this.citiesList = [{text: 'Todas', value:'ALL'},...this.allCities];
        this.changeCity('ALL');
    }
    
    toggleCollapse(): void {
        this.isCollapse = !this.isCollapse;
        this.controlArray.forEach((c, index) => {
            c.show = this.isCollapse ? index < 6 : true;
        });
    }

    resetForm(): void {
        this.validateForm.reset();
    }

    changeCity(cityId: string) {
        this.inputStores.reset();
        if(cityId == null) {
            this.storesList = [];
        }
        if(cityId !== 'ALL') {
            this.storesList = this._uS.stores
                .map((s) => { return {text: s.name, value: s.id, cityId: s.city};})
                .filter((s) => s.cityId === cityId);
        } else {
            this.storesList = this._uS.stores.map((s) => { return {text: s.name, value: s.id};});
        }
    }

    getLabelCity(city) {
        if(city?.length>0) {
            let label = city.replaceAll('_',' ');
            return label.toUpperCase();
        } else {
            return 'N/A';
        }
    }

    changeStores(vals) {
        this.selecteds.stores = vals.map(c => c.value);
    }

    hasError(ctrl) {
     return ctrl.errors ? 'error' : '';
    }

    search(forma: NgForm) {
        if(forma.valid) {
            this.isLoading = true;
            this._uS.getStockByStore(this.selecteds.sku).subscribe({
                next: (resp: any) => {
                    this.filterData(resp.data);
                },
                complete: () => this.isLoading = false
            });
        }
    }

    filterData(data: []) {
        if(this.inputStores.isAllSeleteds) {
            if(this.selecteds.city == 'ALL') {
                this.stockList = data;
            } else {
                this.stockList = data.filter((store: any) => store.cityId == this.selecteds.city);
            }
        } else {
            const stores = this.selecteds.stores;
            this.stockList = data.filter(
                (store: any) => this.selecteds.stores.indexOf(store.storeId) !== -1
            );
        }
    }
}