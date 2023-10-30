import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-canceled',
  templateUrl: './dashboard-canceled.component.html',
  styleUrls: ['./../dashboard.component.scss'] 
})
export class DashboardCanceledComponent implements OnInit {

  active_number = 1;
  constructor() { }

  ngOnInit(): void {
  }


  changeTab($event){
    this.active_number = $event.index + 1
  }

}
