import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportsService } from '../../../services/reports.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-report-amplitude',
  templateUrl: './report-amplitude.component.html',
  styleUrls: ['./report-amplitude.component.scss']
})
export class ReportAmplitudeComponent implements OnInit {

  searchText:string;
  reports: any[] = [];
  reportsAux: any[] = [];
  reportSelected:any;
  
  openRegister: boolean = false;
  
  constructor(
    private _rS:ReportsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this._rS.getReportsAmplitude().subscribe((res:any) => {
      this.reports = res.data.message == "" ? [] : JSON.parse(res.data.message).map((x:any) => {
        return {
          ...x,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(x.url)
        }
      });
    })
  }

  searchData(){
    if(this.searchText !== ''){
      if(this.reportsAux.length === 0) this.reportsAux = this.reports.slice(0);
      this.reports = this.reportsAux.filter(i=> i.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
    }else{
      this.reports = this.reportsAux;
      this.reportsAux = [];
    }
  }

  delete(reportSelected:any, event:Event) {
    event.stopPropagation();
    Swal.fire({
      title: 'Confirmación',
      text: '¿Realmente desea eliminar este reporte?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.value){
        return this._rS.basicLoadPromise( 
          this._rS.deleteReportAmplitude(reportSelected),
          'Elimando reporte',
          'Reporte eliminado',
          'Error en servicio',
          () =>{
            this.getReports();
          }
        );
      }
    });
  }

}
