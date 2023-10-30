export class PaginationLite {

    first: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    last: boolean;
    page: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
      
    get showHome() : boolean { return this.page > 5; }
    get showEnd() : boolean { return (this.totalPages-this.page) > 5; }
    
    get getPages() : number[] {
      let _pages:number[] = [];
      let _group = this.group();
      let _first = ( _group > 1) ? ((_group-1) * 5) + 1 : 1;
      let _last = ((_group*5) < this.totalPages) ? (_group*5) : this.totalPages;
      for(let _i = _first; _i<= _last; _i++) _pages.push(_i);
      return _pages;
    }
    
    constructor() {
      
    }
    
    private group() : number { 
      let d = Math.ceil(this.page / 5);
      return isNaN(d) ? 1 : d;
    }
  
    static parse(newdata:any) {
      let newplite = new PaginationLite();
      if( newdata.hasOwnProperty('first') ) newplite.first = newdata.first;
      if( newdata.hasOwnProperty('hasNext') ) newplite.hasNext = newdata.hasNext;
      if( newdata.hasOwnProperty('hasPrevious') ) newplite.hasPrevious = newdata.hasPrevious;
      if( newdata.hasOwnProperty('last') ) newplite.last = newdata.last;
      if( newdata.hasOwnProperty('number') ) newplite.page = (newdata.number + 1);
      if( newdata.hasOwnProperty('numberOfElements') ) newplite.numberOfElements = newdata.numberOfElements;
      if( newdata.hasOwnProperty('size') ) newplite.size = newdata.size;
      if( newdata.hasOwnProperty('totalElements') ) newplite.totalElements = newdata.totalElements;
      if( newdata.hasOwnProperty('totalPages') ) newplite.totalPages = newdata.totalPages;
      return newplite;
    }
  
  }  