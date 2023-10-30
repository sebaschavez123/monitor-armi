import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnChanges {
  @Input() values: any[] = [];
  @Input() products: any = undefined;
  @Output() hasChanged: EventEmitter<any> = new EventEmitter();

  option;

  ngOnChanges(changes: any){
    if(changes.products) {      
      console.log(this.products);
      //this.products = this.products?.filter(prod => !prod.theorical);
    }
  }

  chkToggle(ck: string) {
      const chk = $(ck);
      if (chk.hasClass('checked')) { chk.removeClass('checked'); } else { chk.addClass('checked'); }
      this.values = $.map($('.ocheck.checked'), (ch: any) => $(ch).data('ocvalue'));
      this.hasChanged.emit(this.values);
    }

  JsonStringify(product: any) {
      const option = {
          image: product.image,
          name: product.itemName,
          cant: product.units,
          price: product.price,
      };
      return JSON.stringify(option);
  }
  getIconStyle(icon: string) { return {'background-image': `url('${icon}')`}; }
  getTotal(value: number) { return new Intl.NumberFormat('es-CO').format(value); }
}
