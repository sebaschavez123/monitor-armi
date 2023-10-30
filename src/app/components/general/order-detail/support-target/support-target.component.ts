import { Component, AfterViewInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SupportOptions } from 'src/app/core/const';
import { Ticket } from 'src/app/core/interfaces';
import { NgForm } from '@angular/forms';
import { SupportService } from 'src/app/services/support.service';
import { countryConfig } from 'src/country-config/country-config';
import { SUPPORT_OPTIONS } from 'src/app/core/support-options';
import { firstValueFrom } from 'rxjs';
import { OrderDetail } from 'src/app/core/models/orderDetail.class';

declare var zE:any;

@Component({
  selector: 'app-support-target',
  templateUrl: './support-target.component.html',
  styleUrls: ['./support-target.component.scss']
})
export class SupportTargetComponent implements AfterViewInit, OnChanges {

  @Input() ticket: Ticket;
  @Input() order: OrderDetail;
  @Input() productsTheoretical: any[];
  @Output() closeEvent = new EventEmitter();
  @Output() refresh = new EventEmitter();
  optionsSupport = [];
  optionSupportSelected: any;
  step = 1;
  idTicketResult:string;
  loading = false;
  frmTouch = false;
  messenger;

  constructor(private _sS: SupportService) {}

  ngAfterViewInit(): void {
    this.getOptions();
  }

  ngOnChanges(changes: any): void {
    if(!this.ticket){
      this.step = 1;
      this.getOptions();
      this.optionSupportSelected = this.getIncident(this.optionSupportSelected);
      this.loading = false;
      this.frmTouch = false;
      this.idTicketResult = undefined;
    }
    if(changes.productsTheoretical){
      this.productsTheoretical = changes.productsTheoretical.currentValue?.slice(0);
    }
  }

  getOptions() {
    this.optionsSupport = (countryConfig.isVenezuela)
      ? SupportOptions.slice(0)
      : SUPPORT_OPTIONS.slice(0);
  }

  selectOptionSupport(op){
    this.optionSupportSelected = op;
    this.step++;
  }

  getIconStyle(icon: any) {
    return {'background-image': `url('${icon}')`};
  }

  get validateSteps() {
    return true;
  }

  actionLeft() {
    this.loading = false;
    this.frmTouch = false;
    if( this.step > 1 && this.step < 3) {
      this.step--;
    } else {
      this.refresh.emit();
      this.closeEvent.emit();
    }
  }

  chkToggle(chk: any, model: any) {
    const ck = $(chk);
    if (ck.hasClass('checked')) {
      ck.removeClass('checked');
    } else {
      ck.addClass('checked');
    }
    model.values = $.map($('.ocheck.checked'), (ch: any) => $(ch).data('ocvalue'));
  }

  JsonStringify(option: any) { return JSON.stringify(option); }

  getIcon(path: any) {
    return {'background-image': `url('${path}')`};
  }

  select_image(file: File) {
    if (file) {
      this.optionSupportSelected.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        $('#upload-file-lbl').css('background-image', `url(${e.target.result})`);
      };
      reader.readAsDataURL(file);
    }
  }

  get textLeft() {
    if (this.step === 1) return 'Cancelar';
    else if (this.step === 3) return 'Finalizar'
    else return 'Atrás'
  }

  get textRight() {
    if (this.step === 2) return 'Finalizar';
    else return 'Siguiente'
  }

  dataSend(forma: NgForm) {
    this.frmTouch = true;
    if (forma.valid) {
      this.loading = true;
      const params: any = this.optionSupportSelected;
      params.forma = forma.value;
      this._sS[this.optionSupportSelected.callback](forma.value, this.order, params)
        .then(
          (results: any) => {
            this.idTicketResult = results.id;
            this.step = 3;
            this.loading = false;
            this.refresh.emit();
          },
        ).catch((err)=>{
          this.loading = false;
        })
    }
  }

  getIncident(data: any) {
    const tmp = {...data};
    if(data?.widgets){
      for (const w of data.widgets) {
        w.value = null;
        w.values = null;
        w.source = null;
        w.comment = null;
        w.checked = null;
        w.mensssager = null;
      }
    }
    return tmp;
  }

  openChat() {
    zE('webWidget', 'open');
  }

  ticketOnOption(option: any) {
    if(!option) return false;
    else 
      if(option?.hasOwnProperty('ticketOn')) return option.ticketOn;
      else return true; // default
  }  
  
  chatOnOption(option: any) {
    if(option?.hasOwnProperty('chatOn')) return option.chatOn;
    else return false; // default
  }

}