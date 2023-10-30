import { Pipe, PipeTransform } from '@angular/core';
import { BaseService } from '../services/base.service';

@Pipe({
    name: 'currencyFormat'
})

export class CurrencyformatPipe implements PipeTransform {

    constructor(private _bS: BaseService){}

    transform(value: any): any {
        return this._bS.formatMoney(value, 0, '.', ',');
    }
}