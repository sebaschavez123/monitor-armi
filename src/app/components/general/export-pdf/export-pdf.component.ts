import { Component, OnInit, Input } from '@angular/core';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { defineFont } from '@progress/kendo-drawing/pdf';

defineFont({
  'Verdana'             : '/fonts/Verdana.ttf',
  'Verdana|Bold'        : '/fonts/Verdana_Bold.ttf',
  'Verdana|Bold|Italic' : '/fonts/Verdana_Bold_Italic.ttf',
  'Verdana|Italic'      : '/fonts/Verdana_Italic.ttf',
  'serif'                  : 'Times-Roman',
  'serif|bold'             : 'Times-Bold',
  'serif|italic'           : 'Times-Italic',
  'serif|bold|italic'      : 'Times-BoldItalic'
});

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html',
  styleUrls: ['./export-pdf.component.scss']
})
export class ExportPdfComponent implements OnInit {

  @Input()
  public data:any [];
  @Input() selectedOrder: any = {};
  @Input() lstProducts: any = {};
  @Input() reportType:string;
  @Input() totalDomicilio: string = "0";
  @Input() totalPrice: string;
  @Input() subTotalPrice: string;

  constructor() { }

  ngOnInit() {
  }

}
