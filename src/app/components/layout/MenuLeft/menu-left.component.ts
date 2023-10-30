import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router'
import { filter } from 'rxjs/operators'
import { transition, trigger, style, animate } from '@angular/animations'
import * as _ from 'lodash'
import { select, Store } from '@ngrx/store'
import { MenuService } from 'src/app/services/menu.service'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import { Subscription } from 'rxjs';
import { countryConfig } from 'src/country-config/country-config';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'air-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  animations: [
    trigger('flyoutAnimation', [
      transition(':enter', [
        style({ transform: 'translate3d(0, calc(-50% + 40px), 0)' }),
        animate('100ms ease-in-out', style({ transform: 'translate3d(0, calc(-50% + 20px), 0)' })),
      ]),
    ]),
  ],
})
export class MenuLeftComponent implements OnInit, OnDestroy {

  isMobileView: boolean
  isMobileMenuOpen: boolean
  isMenuCollapsed: boolean;
  isMenuUnfixed: boolean
  isMenuShadow: boolean
  isSidebarOpen: boolean
  menuType: string
  menuColor: string
  flyoutMenuColor: string
  menuLayoutType: string

  activeSubmenu: string = ''
  renderedFlyoutItems: object = {}
  flyoutTimers: object = {}
  flyoutActive: boolean = false
  objectKeys = Object.keys
  user:any;
  subscribe:Subscription;
  iconLogo: string;

  constructor(
    public menuService: MenuService,
    private store: Store<any>,
    private router: Router,
  ) {
    this.iconLogo = countryConfig.isColombia ? 'assets/images/logo-farmatodo-col.svg' : 'assets/images/logo-farmatodo-vzla.svg';
  }

  ngOnInit() {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.isMobileView = state.isMobileView
      this.isMobileMenuOpen = state.isMobileMenuOpen
      this.isMenuCollapsed = state.isMenuCollapsed
      this.isMenuUnfixed = state.isMenuUnfixed
      this.isMenuShadow = state.isMenuShadow
      this.menuType = state.menuType
      this.menuColor = state.menuColor
      this.flyoutMenuColor = state.flyoutMenuColor
      this.menuLayoutType = state.menuLayoutType
      this.isSidebarOpen = state.isSidebarOpen
      this.flyoutActive =
        (state.menuType === 'flyout' || state.menuType === 'compact' || state.isMenuCollapsed) &&
        !state.isMobileView
    })
    this.setActiveItems(this.router.url)
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.setActiveItems(event.url ? event.url : null)
      });
    this.user = this.menuService.getLocalUser();
  }

  ngOnDestroy(){
    if(this.subscribe)this.subscribe.unsubscribe();
  }

  toggleMobileMenu() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMobileMenuOpen: !this.isMobileMenuOpen,
      }),
    )
  }

  toggleMenu(change?:boolean) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isMenuCollapsed: change != undefined ? change : !this.isMenuCollapsed,
      }),
    )
  }

  toggleSettings() {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        isSidebarOpen: !this.isSidebarOpen,
      }),
    )
  }

  handleSubmenuClick(key: string) {
    const currentKey = this.activeSubmenu;
    if (this.flyoutActive) {
      return
    }
    this.activeSubmenu = currentKey === key ? '' : key
  }

  setActiveItems(pathname) {
    const activeItem = this.menuService.getItem(pathname);
    if(activeItem && activeItem.key) this.menuService.activeSection = activeItem.key;
    const menuData = this.menuService.menu;
    const activeSubmenu = menuData.reduce((key, parent) => {
      if (Array.isArray(parent.children)) {
        parent.children.map(child => {
          if (activeItem && child.key === activeItem.key) {
            key = parent
          }
          return ''
        })
      }
      return key
    })

    this.menuService.activeItem = activeItem ? activeItem.key : this.menuService.childrenRoute();
    this.toggleMenu(this.menuService.isFullScreen());
    this.activeSubmenu = activeSubmenu.key
  }

  handleFlyoutOver(event, key, items) {
    if (this.flyoutActive) {
      clearInterval(this.flyoutTimers[key])
      const item = event.currentTarget
      const itemDimensions = item.getBoundingClientRect()
      this.renderedFlyoutItems = {
        ...this.renderedFlyoutItems,
        [key]: {
          key,
          itemDimensions,
          items,
        },
      }
    }
  }

  handleFlyoutOut(key) {
    if (this.flyoutActive) {
      this.flyoutTimers[key] = setTimeout(() => {
        const updatedFlyoutItems = Object.assign({}, this.renderedFlyoutItems)
        delete updatedFlyoutItems[key]
        this.renderedFlyoutItems = {
          ...updatedFlyoutItems,
        }
      }, 100)
    }
  }

  handleFlyoutContainerOver(key) {
    clearInterval(this.flyoutTimers[key])
  }

  isActive(option) {
    const allowed: string[] = this.menuService.getPermissions(option.moduleName)?.allowed;
    if(!!allowed && allowed.length > 0) {
      return allowed?.find((i) => i.toLowerCase() == option.key.toLowerCase());
    }
    return true;
  }

  extractSVG(item) {
    return !!item.svg ? `/assets/svg/${item.svg}.svg` : '';
  }
}
