import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search-component.html',
  styleUrls: ['./input-search-component.scss']
})
export class InputSearchComponent implements AfterViewInit {

    strkey: string = '';
    timer: any = undefined;
    delay: number = 600;
    @Input() placeholder : string = 'Búscar ...';
    @Output() onSearch: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngAfterViewInit() {
        
    }
    search(event:KeyboardEvent) {
        clearTimeout(this.timer);
        if(event.keyCode == 13) {
            this.runSearch();
        }
        else {
            if(this.strkey.length > 0) {
            this.timer = setTimeout(() => this.runSearch(), this.delay);
            }
        }
        return false;
    }

    clearText() {
        if(this.strkey.length > 0 ) this.strkey = '';
        this.runSearch();
    }

    runSearch() {
        this.onSearch.emit(this.strkey);
    }

}
