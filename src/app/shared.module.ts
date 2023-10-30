import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { PipesModule } from './pipes/pipes.module'
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DirectivesModule } from './directives/directives.module';

const MODULES = [
  CommonModule,
  RouterModule,
  NzTableModule,
  NzUploadModule,
  NzButtonModule,
  NzIconModule,
  NzModalModule,
  NzInputModule,
  NzDropDownModule,
  NzCheckboxModule,
  NzMenuModule,
  NzProgressModule,
  NzBadgeModule,
  NzAvatarModule,
  NzLayoutModule,
  NzToolTipModule,
  NzFormModule,
  NzSelectModule,
  NzDatePickerModule,
  NzTabsModule,
  NzRadioModule,
  NzPopconfirmModule,
  NzTransferModule,
  NzMessageModule,
  NzNotificationModule,
  NzTimelineModule,
  NzTagModule,
  NzSpinModule,
  PipesModule,
  DirectivesModule,
  NzTimePickerModule,
]

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class SharedModule {}
