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
    incentivesType: { id: number, incentiveName: string, description: string }[] = [];
    $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
    disabled = false;
    showSearch = false;
    storesIncludedIncentiveChange = [];

    labels = ['Tiendas Excluidas', 'Tiendas Incluidas'];
    filteredItems: any[] = [];
    constructor(private _iS: IncentiveService) { }

    ngOnInit(): void {
        this.getIncentivetypes();
        this.getData();
    }

    changeIncentive(store) {
        if (store.direction == 'right') {
            let storeSelected = this.register.cityConfigs.
                find(cityConfig => cityConfig.cityId === store.cityId).storeConfigs.
                find(storeTemp => storeTemp.storeId === store.storeId)
            if (store.typeIncentive !== storeSelected.typeIncentive) {
                this.storesIncludedIncentiveChange.push(store);
            } else {
                this.storesIncludedIncentiveChange = this.storesIncludedIncentiveChange.filter(item => item !== store);
            }
        }
    }

    save() {
        console.log(this.storesIncludedIncentiveChange)
        this._iS.saveIncentivesChange(this.storesIncludedIncentiveChange).subscribe(res => console.log(res))
        // for (let index = 0; index < this.list.length; index++) {
        //     const row = this.list[index];
        //     let city = {...this.register.cityConfigs[row.key]};
        //     city.storeConfigs[row.index].typeIncentive = row.typeIncentive;
        //     city.storeConfigs[row.index].active = row.direction == 'right';
        //     this.register.cityConfigs[row.key] = {...city};
        // }

        // this._iS.basicLoadPromise(
        //     firstValueFrom(this._iS.setArmireneIncentives(this.register)),
        //     "Actualizando ...",
        //     "¡Información actualizada!",
        //     "Error al actualizar información!!"
        // );

    }

    reset() {
        this.list = [];
        this.storesIncludedIncentiveChange = [];
        for (let index = 0; index < this.register.cityConfigs.length; index++) {
            const city = this.register.cityConfigs[index];
            this.setCityToList(city, index);
        }
        this.list = [...this.list];
    }

    getIncentivetypes() {
        this._iS.getIncentiveTypes().subscribe({
            next: (resp: any) => {
                this.incentivesType = resp;
            }
        });
    }

    getData() {
        this.loadingData = true;
        this._iS.getArmireneIncentives().subscribe({
            next: (resp: any) => {
                this.register = resp;
                this.reset();
            },
            complete: () => this.loadingData = false
        });
    }

    setCityToList(city: any, node: number) {
        if (city?.storeConfigs?.length > 0) {
            for (let index = 0; index < city.storeConfigs.length; index++) {
                const store = city.storeConfigs[index];
                this.list.push({
                    key: node, index,
                    title: `(${city.cityId}) ${this._iS.getStoreName(store.storeId)}`,
                    direction: (store.active) ? 'right' : 'left',
                    typeIncentive: store.typeIncentive,
                    storeId: store.storeId,
                    cityId: city.cityId
                });
                this.filteredItems = this.list;
            }
        }
    }

    getIncentiveTypeLabel(id: number) {
        const incentiveType = this.incentivesType.filter((ict: any) => ict.id == id);
        return incentiveType[0]?.incentiveName || '';
    }

    select(event) { }
    change(event) { }


    search(search, direction) {
        this.filteredItems = this.filterItems(search, direction);
    }

    filterItems(term: string, direction): any[] {
        let oppositeDirection = direction == 'left' ? 'right' : 'left'
        let a = this.list.filter(item => item.direction == oppositeDirection);
        let b = this.list.filter(item => (
            item.title.toLowerCase().includes(term.toLowerCase()) ||
            JSON.stringify(`${item.typeIncentive}X1`).toLowerCase().includes(term.toLowerCase())) && item.direction == direction);
        return a.concat(b);
    }
}