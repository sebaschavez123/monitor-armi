import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ReportsService } from '../../../../services/reports.service';

@Component({
  selector: 'app-report-amplitud-register',
  templateUrl: './report-amplitud-register.component.html',
  styleUrls: ['./report-amplitud-register.component.scss']
})
export class ReportAmplitudRegisterComponent implements OnInit, OnChanges {

  @Input() show:boolean = false;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter();

  forma:UntypedFormGroup;
  loadingForm:boolean = false;

  constructor(
    private _rS:ReportsService
  ) {
    this.forma = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      url: new UntypedFormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes.show){
      if(!this.show){
        this.forma.reset()
        return;
      }
    }
  }

  save() {
    this.loadingForm = true;
    this._rS.basicLoadPromise(
      this._rS.saveReportAmplitude(this.forma.value),
      "Guardando nuevo reporte",
      "Reporte guardado",
      "Error en servicio",
      ()=>{
        this.loadingForm = false;
        this.forma.reset();
        this.close.emit();
        this.refresh.emit();
      }
    );
  }

}
