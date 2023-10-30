import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from '../../../../services/version-check.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'air-topbar-version-check',
  templateUrl: './version-check.component.html',
  styleUrls: ['./version-check.component.scss']
})
export class VersionCheckComponent implements OnInit {

  constructor(public versionCheck:VersionCheckService) { }

  ngOnInit(): void {
  }

  reload(){
    window.location.replace('/path');
  }

}
