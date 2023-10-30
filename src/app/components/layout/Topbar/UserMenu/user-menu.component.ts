import { Component } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { User } from 'src/app/core/interfaces';

@Component({
  selector: 'air-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  badgeCount: number = 0
  user:User;

  constructor(public authService: AuthService) {
    this.user = authService.getLocalUser();
  }

  

  logout() {
    this.authService.SignOut()
  }
}
