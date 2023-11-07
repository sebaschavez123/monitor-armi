import { Component, OnInit } from '@angular/core';
import { IncentiveService } from 'src/app/services/incentive.service';
import { Store } from '../../../core/interfaces';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-store-2x1-ftd',
    templateUrl: './stores2x1ftd.component.html',
    styleUrls: ['./stores2x1ftd.component.scss']
})

export class Store2x2FtdComponent implements OnInit {
    loadingData = false;
    register: any = null;
    list: TransferItem[] = [];
    incentivesType: {id: number, incentiveName: string, description: string}[] = [];
    $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
    disabled = false;
    showSearch = false;

    labels = ['Tiendas Excluidas', 'Tiendas Incluidas'];
    
    constructor(private _iS: IncentiveService) { }

    ngOnInit(): void {
        this.getIncentivetypes();
        this.getData();
      }
    
    save(){
        for (let index = 0; index < this.list.length; index++) {
            const row = this.list[index];
            let city = {...this.register.cityConfigs[row.key]};
            city.storeConfigs[row.index].typeIncentive = row.typeIncentive;
            city.storeConfigs[row.index].active = row.direction == 'right';
            this.register.cityConfigs[row.key] = {...city};
        }

        this._iS.basicLoadPromise(
            firstValueFrom(this._iS.setArmireneIncentives(this.register)),
            "Actualizando ...",
            "¡Información actualizada!",
            "Error al actualizar información!!"
        );
    }
    
    reset() {
        this.list = [];
        for (let index = 0; index < this.register.cityConfigs.length; index++) {
            const city = this.register.cityConfigs[index];
            this.setCityToList(city, index);
        }
        this.list = [...this.list];
    }
    
    getIncentivetypes() {
        this._iS.getIncentiveTypes().subscribe({
            next: (resp:any) => {
                this.incentivesType = resp;
            }
        });
    }

    getData() {
        this.loadingData = true;
        this._iS.getArmireneIncentives().subscribe({
            next: (resp:any) => {
                this.register = resp;
                this.reset();
            },
            complete: () => this.loadingData = false
        });
    }

    setCityToList(city: any, node: number) {
        if(city?.storeConfigs?.length > 0) {
            for (let index = 0; index < city.storeConfigs.length; index++) {
                const store = city.storeConfigs[index];
                this.list.push({
                    key: node, index,
                    title: `(${city.cityId}) ${this._iS.getStoreName(store.storeId)}`,
                    direction: (store.active) ? 'right' : 'left',
                    typeIncentive: store.typeIncentive
                });
            }
        }
            
    }

    getIncentiveTypeLabel(id: number) {
        const incentiveType = this.incentivesType.filter((ict: any) => ict.id == id);
        return incentiveType[0]?.incentiveName || '';
    }

    select(event) {}
    change(event) {}

}