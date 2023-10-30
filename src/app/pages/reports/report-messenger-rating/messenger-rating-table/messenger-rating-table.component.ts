import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-ms-table',
    templateUrl: './messenger-rating-table.component.html',
    styleUrls: ['./messenger-rating-table.component.scss']
})

export class MessengerRatingTableComponent implements OnInit {
    
    listOfData: any[];
    listOfDisplayData : any[];
    activeFilters: any[] = [];
    isLoading = false;

    align = ['left', 'center', 'right'];

    @Input() options: any = {};
    @Output() changerValue = new EventEmitter() ;

    constructor(
        private _rS: ReportsService
    ) { }

    ngOnInit() {
        this.getData();
    }


    onCurrentPageDataChange(event){}

    getData() {
        console.log(this.options.service);
        this.isLoading = true;
        if(this.options.service) {
            this._rS[this.options.service]().then(({data})=>{
                this.listOfData = data || [];
                this.listOfDisplayData = this.listOfData;
                this.isLoading = false;
            });
        }
    }

    changeList(filters){
        this.activeFilters = filters;
        this.search(this.options.cols[0]);
    }

    reset(col: any): void {
        col.searchValue = '';
        this.search(col);
    }
    
    search(col: any): void {
        col.showSearchInput = false;
        const listFiltred = (this.activeFilters.length < 1)
            ? this.listOfData : this.filterData();
        this.listOfDisplayData = listFiltred?.filter((item: any) => {
            return item[col.fieldName].localeCompare(col.searchValue) !== -1
        });
    }

    filterData() {
        let resp = [];
        this.activeFilters.forEach((filter)=>{
            resp = [
                ...resp,
                ...this.listOfData
                    .filter(i => filter.func(i, filter.text))
            ];
        })
        return resp;
    }
}