import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { SharedModule } from 'src/app/shared.module'

import { TopbarComponent } from './Topbar/topbar.component'
import { TopbarActionsComponent } from './Topbar/Actions/actions.component'
import { TopbarIssuesHistoryComponent } from './Topbar/IssuesHistory/issues-history.component'
import { TopbarLanguageSwitcherComponent } from './Topbar/LanguageSwitcher/language-switcher.component'
import { TopbarSearchComponent } from './Topbar/Search/search.component'
import { TopbarStatusComponent } from './Topbar/Status/status.component'
import { TopbarUserMenuComponent } from './Topbar/UserMenu/user-menu.component'
import { SubbarComponent } from './SubBar/subbar.component'
import { MenuLeftComponent } from './MenuLeft/menu-left.component'
import { FooterComponent } from './Footer/footer.component';
import { VersionCheckComponent } from './Topbar/version-check/version-check.component';
import { SpeedometerComponent } from './Topbar/speedometer/speedometer.component'
import { InlineSVGModule } from 'ng-inline-svg-2';

const COMPONENTS = [
  TopbarComponent,
  TopbarActionsComponent,
  TopbarIssuesHistoryComponent,
  TopbarLanguageSwitcherComponent,
  TopbarSearchComponent,
  TopbarStatusComponent,
  TopbarUserMenuComponent,
  SubbarComponent,
  MenuLeftComponent,
  FooterComponent,
  VersionCheckComponent,
  SpeedometerComponent
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    InlineSVGModule.forRoot(),
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class LayoutModule {}
