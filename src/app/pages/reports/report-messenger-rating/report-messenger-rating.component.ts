import { Component } from '@angular/core';
import { ColumnMS } from './models/column-ms.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-report-messenger-rating',
    templateUrl: './report-messenger-rating.component.html',
    styleUrls: ['./report-messenger-rating.component.scss']
})

export class MessengerRatingComponent {

    elements = [
        {
            title: 'Top Nivel de servicio cantidad',
            service: 'getServiceLevelQuantity',
            key: 'slq',
            filters: this.getFilters(),
            cols: <ColumnMS[]>[
                new ColumnMS(
                    'Nombre mensajero',
                    'courierName',
                    'text',
                    'left',
                    (a:any, b: any) => a.courierName.localeCompare(b.courierName) !== -1,
                    null,
                    true
                ),
                new ColumnMS(
                    '% Nivel de servicio cantidad',
                    'orderFinishPercentage',
                    'percent',
                    'center',
                    (a:any, b: any) => a.orderFinishPercentage - b.orderFinishPercentage
                ),
                new ColumnMS(
                    'Q ordenes',
                    'totalOrders',
                    'numeric',
                    'center',
                    (a:any, b: any) => a.orderFinishPercentage - b.orderFinishPercentage
                )
            ],
        },
    ];

    constructor(
        private _rS: ReportsService
    ) {}

    private getFilters() {
        return [{
            title: '',
            filterFn: (item: any, key: string) => item.providerName == key,
            options: this.getProvidersList()
        }]
    }

    private getProvidersList() {
        return this._rS.providers.map(l => ({text: l.label, value: l.value}))
    }
    
}