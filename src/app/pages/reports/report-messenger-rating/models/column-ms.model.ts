import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export class ColumnMS {

    public showSearchInput = false;
    public searchValue = '';
    constructor(
        public name: string,
        public fieldName: string,
        public datatype: 'text' | 'numeric' | 'percent' = 'text',
        public align: 'left' | 'right' | 'center' = 'left',
        public sortFn = null,
        public sortOrder: NzTableSortOrder =  null,
        public hasSearch = false,
        public filterFn: NzTableFilterFn =  null,
        public filterMultiple: boolean =  null,
        public listOfFilter: NzTableFilterList = [],
    ) {}

    getFormatedData(data) {
        switch (this.datatype) {
            case 'numeric':
                return data[this.fieldName];
                break;
            case 'percent':
                return data[this.fieldName]+'%';
                break;
            default: // text
                return data[this.fieldName]
                break;
        }
    }

}