import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { SharedModule } from 'src/app/shared.module'
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PickingComponent } from './order-detail/picking/picking.component';
import { MapComponent } from './order-detail/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ExportPdfComponent } from './export-pdf/export-pdf.component';
import { DataOptionsComponent } from './data-options/data-options.component';
import { AbbCourierName } from '../../pipes/abbCourierName.pipe';
import { FilterComponent } from './orders-table/filter/filter.component';
import { SwitchButtomComponent } from './switch-buttom/switch-buttom.component';
import { SupportTargetComponent } from './order-detail/support-target/support-target.component';
import { ProductsListComponent } from './order-detail/support-target/products-list/products-list.component';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { PaymentDetailComponent } from './order-detail/payment-detail/payment-detail.component';
import { ObservationsComponent } from './observations/observations.component';
import { GluedComponent } from './glued/glued.component';
import { FormAwareComponent } from './order-detail/form-aware/form-aware.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzListModule } from 'ng-zorro-antd/list';
import {ScrollingModule} from '@angular/cdk/scrolling'
import { NzImageModule } from 'ng-zorro-antd/image';
import { TransferComponent } from './order-detail/transfer/transfer.component';
import { TransferMapComponent } from './order-detail/transfer/transfer-map/transfer-map.component';
import { SelectStoreTransferComponent } from './order-detail/transfer/select-store-transfer/select-store-transfer.component';
import { InfoModalComponent } from './order-detail/picking/info-modal/info-modal.component';

const COMPONENTS = [
    OrdersTableComponent,
    OrderDetailComponent,
    PickingComponent,
    MapComponent,
    ExportPdfComponent,
    DataOptionsComponent,
    FilterComponent,
    SwitchButtomComponent,
    ProductsListComponent,
    SupportTargetComponent, 
    AddressEditComponent,
    PaymentDetailComponent,
    ObservationsComponent,
    GluedComponent,
    TransferComponent,
    TransferMapComponent,
    SelectStoreTransferComponent,
    FormAwareComponent,
    InfoModalComponent
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    LeafletModule,
    PDFExportModule,
    NzCheckboxModule,
    NzListModule,
    NzImageModule,
    ScrollingModule
  ],
  declarations: COMPONENTS,
  providers: [AbbCourierName],
  exports: COMPONENTS,
})
export class GeneralModule {}