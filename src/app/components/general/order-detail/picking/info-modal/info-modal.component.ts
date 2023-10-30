import { Component, Input, Output, EventEmitter } from '@angular/core';
import {  NgForm, NgModel } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { countryConfig } from 'src/country-config/country-config';

@Component({
    selector: 'app-info-modal',
    templateUrl: './info-modal.component.html',
    styleUrls: ['./info-modal.component.scss']
})

export class InfoModalComponent {

    show = false;
    frmtouch = false;
    title = '';
    isLoading = false;
    options = null;
    @Output() submit = new EventEmitter();
    @Input() set mdlOptions(dat) {
        this.options ={
            textarea:{ placeholder: ''},
            uploads:{limitUpdates: 1},
            ...dat
        };
    };

    get headers () { return countryConfig.headersNgZorro; }
    
    constructor(private _dS: DashboardService) { }
   

    loadEvidence(event, inpfiles: NgModel) {
        if(event.fileList.length > 0)
            inpfiles.control.setValue(
                event.fileList.map(i => i.response?.link)
            );
        else 
            inpfiles.control.setValue([]);
    }

    open() {
        this.show = true;
        this.frmtouch = false;
    }

    close() {
        this.show = false;
        this.frmtouch = false;
    }
   
   
    action(forma: NgForm) {
        this.frmtouch = true;
        this.submit.emit(forma.value);
    }
    
    getUploadFileUrl() { return this._dS.upload+'/upload'; }


      
   
}