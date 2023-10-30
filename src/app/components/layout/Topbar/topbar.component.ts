import { Component } from '@angular/core'
import { DownloadStatusEvent } from 'src/app/event-listeners/download-status.event';

@Component({
  selector: 'air-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  constructor(downloadStatus : DownloadStatusEvent){
    downloadStatus.downloadStatus.subscribe((res:any)=>{
    })
  }


}
