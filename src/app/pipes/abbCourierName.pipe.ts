import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'abbCourierName'})

export class AbbCourierName implements PipeTransform {
  transform(name: string): string {
    if (name === "RUNER") return "RN";
    else if (name === "MENSAJEROS URBANOS") return "MU";
    else if (name === "ALIANZA LOGISTICA") return "AL";
    return name;
  }
}