import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadStatusEvent {

  private event = new Subject();
  downloadStatus = this.event.asObservable();

  constructor() { }

  updateStatus(event: any) {
    this.event.next(event);
  }
}