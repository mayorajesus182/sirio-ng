import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { filter, map } from 'rxjs/operators';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { NavigationService } from '../../@sirio/services/navigation.service';
import { ThemeService } from '../../@sirio/services/theme.service';
import { SidebarDirective } from '../../@sirio/shared/sidebar/sidebar.directive';
import { checkRouterChildsData } from '../../@sirio/utils/check-router-childs-data';
import { SidenavItem } from './sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav/sidenav.service';

@Component({
  selector: 'sirio-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  @ViewChild('configPanel', { static: true }) configPanel: SidebarDirective;

  sidenavOpen$ = this.sidenavService.open$;
  sidenavMode$ = this.sidenavService.mode$;
  sidenavCollapsed$ = this.sidenavService.collapsed$;
  sidenavExpanded$ = this.sidenavService.expanded$;
  quickPanelOpen: boolean;

  sideNavigation$ = this.themeService.config$.pipe(map(config => config.navigation === 'side'));
  topNavigation$ = this.themeService.config$.pipe(map(config => config.navigation === 'top'));
  toolbarVisible$ = this.themeService.config$.pipe(map(config => config.toolbarVisible));
  toolbarPosition$ = this.themeService.config$.pipe(map(config => config.toolbarPosition));
  footerPosition$ = this.themeService.config$.pipe(map(config => config.footerPosition));

  scrollDisabled$ = this.router.events.pipe(
    filter<NavigationEnd>(event => event instanceof NavigationEnd),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.scrollDisabled))
  );

  constructor(
    
    private navService: NavigationService,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    translate: TranslateService,
    private snack: SnackbarService,
    private route: ActivatedRoute,
    private router: Router) {




  }

  ngOnInit() {
    console.log('loading layout');

    let menuItems = [] as SidenavItem[];

    const dashboardItem = {
      label: 'MENU',
      type: 'subheading',
      customClass: 'first-subheading'
    } as SidenavItem;
    // const separator = { type: 'separator', label: 'Menu Principal',subpermisos: [] };
    // this.menuItems.push(separator);
    menuItems.push(dashboardItem);
    this.navService.get().subscribe(data => {

      // console.log('loading menu', data);
      let r = data.map(el => {el.type = 'item'; return el; });
      this.sidenavService.items=[];
      this.sidenavService.addItems(menuItems.concat(r));
      this.sidenavService.getItemByRoute(this.router.url);
    });


  }

  openQuickPanel() {
    this.quickPanelOpen = true;
  }

  openConfigPanel() {
    this.configPanel.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  ngOnDestroy(): void { }
}

