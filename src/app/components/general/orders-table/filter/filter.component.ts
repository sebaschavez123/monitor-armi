import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'general-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {

  @Input() name : string;
  @Input() label : string;
  @Input() key : string;
  @Input() keyLocal : string;
  @Input() placeholder : string = 'Filtrar item';
  @Input() options : Array<any> = [];
  @Input() function : Function;
  @Input() advance : boolean;
  @Input() disabled = false;
  @Input() allSelectedText = 'Todos'
  @Input() defaultAllState = false;
  @Input('filters') allFilters : Array<any>;
  @Input() changeStoreList: any[];
  @Input() asControl: boolean = false;
  @Input() byDefault: boolean = false;
  @Output() filterEvent = new EventEmitter();
  @Output() changeStoreListEvent = new EventEmitter();
  propagateChange = (_: any) => { /*This is intentional*/ };
  propagateTouched = () => { /*This is intentional*/ };
  open = false;
  filterActive = false;
  searchText = '';
  backupOptions;

  ngOnInit(): void {
    this.initChecks();
    if(this.byDefault){
      setTimeout(() => {
        this.initChecks(true);
        this.action();
      }, 600);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.options) {
      this.options = this.options.map(i => {
        i.func = this.function;
        i.key = this.key;
        i.keyLocal = this.keyLocal;
        i.check = this.defaultAllState;
        return i
      });      
      this.backupOptions = this.options.slice(0);
      this.action();
    }
    if(changes.disabled){
      if(this.disabled && this.verifyChecks()) this.disabled = false;
    }
  }

  searchItem() {
    this.searchItemAdvance();
  }
  
  searchItemNormal() {
    if (this.searchText.length > 0) {
      this.options = this.backupOptions.slice(0).filter(opt => opt.text.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
    } else {
      this.options = this.backupOptions.slice(0);
    }
  }

  searchItemAdvance() {
    const tmp: string = this.searchText.toLowerCase();
    if (tmp.length > 0) {
      const vec: string[] = tmp.split(',').map(item => item.trim());
      if(vec.length > 1) {
        this.options = this.backupOptions.slice(0).filter((option) => {
          let valueType = typeof option.text
          return valueType === 'string' ? vec.indexOf(option.text.toLowerCase())>= 0: option.text;
        });
      } else {
        //this.options = this.backupOptions.slice(0).filter(opt => opt.text.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
        this.options = this.backupOptions.slice(0).filter(opt => {
          let valueType = typeof opt.text
         return valueType === 'string' ? opt.text.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 :
          opt.text == this.searchText
        });
      }
    } else {
      this.options = this.backupOptions.slice(0);
    }
  }

  cleanSearch() {
    if (this.searchText.length > 0) {
      this.searchText = '';
      this.options = this.backupOptions.slice(0);
    }
  }

  verifyChecks(){
    return this.options.filter(i => i.check === true).length > 0;
  }

  reset() {
    this.searchText = '';
    this.clearFilters();
    this.options.forEach(i => { i.check = false });
    this.onChange();
    this.filterEvent.emit(this.allFilters);
    this.filterActive = false;
    this.open = false;
  }

  action(){
    if(this.verifyChecks()){
      this.clearFilters();
      const newFilters = this.options.filter(i => i.check === true);
      for (const filter of newFilters) {
        this.allFilters.push(filter);
      }
      this.onChange();
      this.filterEvent.emit(this.allFilters);
      this.filterActive = true;
      this.open = false;
    }else
      this.reset();
  }

  initChecks(sw = false){
    this.options = this.options.map(i => {i.check = sw; return i});
  }

  private clearFilters(){
    for (let i = 0; i < this.allFilters.length; i++) {
      const f = this.allFilters[i];
      const opts = this.options.filter(o => f.value === o.value)
      if(opts.length > 0) this.allFilters[i] = null;
    }
    this.allFilters = this.allFilters.filter(f => f != null);
    this.onChange();
  }

  getControlName() {
    const selectedItems = this.options.filter(item => item.check);
    if(this.options.length == selectedItems.length) return this.allSelectedText;
    if (selectedItems.length > 0 && this.verifyChecks() && this.filterActive) {
      if(selectedItems.length == 1) {
        // return selectedItems[0]?.text.toUpperCase();
        let typeData = typeof selectedItems[0]?.text;
        return  typeData === 'string' ?  selectedItems[0]?.text.toUpperCase() : selectedItems[0]?.text
      }
      const list = selectedItems.slice(0,2).map(x => {
        let typeData = typeof x.text;
        return typeData === 'string' ? x.text.toUpperCase() : x?.text;
      });
      let resp = list.join(', ').substring(0,28);
      if(selectedItems.length > 2) resp += ` ... (+${(selectedItems.length - 2)})`;
      return resp;
    } else  {
      return this.label || this.name;
    }
  }

  get isAllSeleteds() : boolean{
    const selectedItems = this.options.filter(x => x.check);
    return (this.options.length == selectedItems.length);
  }

  onChange() {
    this.propagateChange(this.allFilters);
  }

  registerOnChange(fn: any): void {
      this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.propagateTouched = fn;
  }

}
