import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'timestamp'
  })
export class TimestampPipe implements PipeTransform {
  
    transform(timestamp:any): any {
      let date = new Date(timestamp*1);
      return date.getDate() + " - " + (date.getMonth() + 1) + " - " + date.getFullYear();
    }
  
  }