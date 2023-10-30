import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FilterComponent } from 'src/app/components/general/orders-table/filter/filter.component';
import { DefaultIncentive, Incentive, IncentiveTypes } from 'src/app/core/models/incentive.class';
import { IncentiveService } from 'src/app/services/incentive.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
    selector: 'app-incentive-form',
    templateUrl: 'incentive-form.component.html',
    styleUrls: ['incentive-form.component.scss']
})

export class IncentiveFormComponent implements OnInit, AfterViewInit {

    editMode = true;
    frmTouched = false;
    valuesList: number[] = [];
    valuesListMax: number[] = [];
    selectList: {text: String,value: any}[] = [];
    incentiveTypes = [...IncentiveTypes];
    incentiveType = IncentiveTypes[0];
    mdlOpen = false;
    incentive: Incentive = {
        value: 0, valueMax: 0, valueMin: 0,
        dates: [new Date(1661531400), new Date(1661445000)],
        list: [],
    };
    
    @ViewChild(FilterComponent) incentiveList: FilterComponent;
    @Input() defaultValues: DefaultIncentive;
    @Output() updateData: EventEmitter<any> = new EventEmitter();
    
    constructor(private _iS: IncentiveService,) {
        this._iS.getValuesList().subscribe(data => this.valuesList = data);
     }

    ngAfterViewInit() {
    }
    ngOnInit() {
        const maxValue = countryConfig.isColombia ? 20000 : 10;
        const incrementValue = countryConfig.isColombia ? 500 : 1;
        setTimeout(() => {
            for (let index = this.defaultValues.valueMin; index <= maxValue; index+=incrementValue) {
                // if(index <= this.defaultValues.valueMax) this.valuesList.push(index);
                this.valuesListMax.push(index);
            }
            this.changeType();
            
        }, 1200);
        this.changeType();
    }

    get valuesListMin(): number[] {
        return this.valuesListMax.filter(value => value <= this.incentive.value);
    }

    changeType() {
        this.selectList = [];
        this.incentiveList?.reset();
        const list = this._iS[this.incentiveType.service];
        this.incentiveType.service !== 'incentiveByKm' ?
        this.selectList = list.map(listIncentive =>{
            return {
                text:listIncentive.name,
                value: listIncentive[this.incentiveType.key]
            };
         })
         :
         this.selectList = list.map((listIncentive, position )=>{
            return{
                text:listIncentive,
                value: listIncentive
            };
         })
    }

    getFormatPrice(price: number): string {
        return this._iS.getFormatPrice(price);
    }

    setIncentive(dat: any, incentiveType: any) {
        this.incentiveType = incentiveType;
        this.changeType();
        if(!!dat) {
            this.editMode = true;
            const id = dat.cityId || dat.storeId || dat.courierId;
            this.incentive = {
                id,
                title: this.incentiveType.label,
                oid: dat.oid,
                value: dat.value || 0,
                valueMin: dat.valueMin || 0,
                valueMax: dat.valueMax || 0,
                dates: [ new Date(dat.incentiveStartDate),new Date(dat.incentiveEndDate)],
                list: [{text: id, value: id}]
            }
            if(dat.cityId) this.incentive.cityId = dat.cityId;
            if(dat.cityName) this.incentive.cityName = dat.cityName;
            if(dat.storeId) this.incentive.storeId = dat.storeId;
            if(dat.storeName) this.incentive.storeName = dat.storeName;
            if(dat.courierId) this.incentive.courierId = dat.courierId;
            if(dat.courierName) this.incentive.courierName = dat.courierName;
            if(dat.km) this.incentive.km = dat.km;
        } else {
            this.editMode = false;
            this.incentive = {
                value: this.defaultValues.value || 0,
                valueMin: this.defaultValues.valueMin || 0,
                valueMax: this.defaultValues.valueMax || 0,
                dates: [new Date()],
                list: []
            }
        }
        this.mdlOpen = true;
    }

    getCityName(cityId: string) {
        const cityName = this._iS.cities.filter((c) => c.value == cityId);
        return (cityName?.length > 0) ? cityName[0].label : 'NA';
    }
    getStoreName(storeId: number) {
        const storeName = this._iS.stores.filter((c) => c.id == storeId);
        return (storeName?.length > 0) ? storeName[0].name : 'NA';
    }

    getCourierName(courierId: number) {
        const courierName = this._iS.couriers.filter((c) => c.id == courierId);
        return (courierName?.length > 0) ? courierName[0].name : 'NA';
    }

    modalToogle(sw:boolean = true) {
        this.frmTouched = false;
        this.incentiveList?.reset();
        this.mdlOpen = sw;
    }

    dataSend(forma: NgForm) {
        this.frmTouched = true;
        if(this.incentive.list.length < 1) return;
        const f = forma.value
        let data: any = {
            base: {
                value: f.value,
                valueMin: f.valueMin,
                valueMax: f.valueMax,
                incentiveStartDate: f.dates[0].getTime(),
                incentiveEndDate: f.dates[1].getTime()
            },
            tpid: this.incentiveType.iddb,
            type: this.incentiveType.value
        }
        if(this.editMode) {
            data.oid = this.incentive.oid;
            data.edit = true;
            data.list = [this.incentive.id];
        } else {
            data.edit = false;
            data.list = forma.value.list.map(x=>x.value);

        }

        let incentiveLog = null;
        if(countryConfig.isColombia) {
            incentiveLog = {
                incentiveType: this.incentiveType?.label,
                valuee: f?.value,
                startDate: f?.dates[0]?.toJSON()?.slice(0, 10),
                endDate: f?.dates[1]?.toJSON()?.slice(0, 10),
                given: f?.list?.map(item => item?.text)?.toString(),
            };
        }
        this.updateData.emit({data, incentiveLog});
    }
    
    activeFilter(event) { this.incentive.list = event }
}