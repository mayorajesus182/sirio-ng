import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';

import { filter, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/@sirio/constants';
import { SessionService } from 'src/@sirio/services/session.service';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { IdleWarningComponent } from 'src/@sirio/shared/idle-snack/idle-warning.component';
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

  // @ViewChild('configPanel', { static: true }) configPanel: SidebarDirective;
  private snackIdle: MatSnackBarRef<any>;
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
    private userIdle: Idle,
    private navService: NavigationService,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    translate: TranslateService,
    private snack: SnackbarService,
    private sessionService: SessionService,
    private matDialogRef: MatDialog,
    private router: Router) {




  }


  private idleConfig(): void {

    // sets an idle timeout of 15 seconds.
    this.userIdle.setIdle(GlobalConstants.TIMEOUT_CONVERT);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.userIdle.setTimeout(GlobalConstants.IDLE_TIMEOUT);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.userIdle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.userIdle.watch();

    this.userIdle.onTimeout.subscribe(() => {

      this.snackIdle.dismiss();
      console.log('Timed out!');

      this.matDialogRef.closeAll();
      this.sessionService.lockscreen();
      // this.router.navigate(['/user/locked']);
    });

    this.userIdle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!');
      this.snackIdle = this.snack.show({ type: 'sirio', message: '', timeout: 149900 }, IdleWarningComponent);

    });


    this.userIdle.onIdleEnd.subscribe(() => { 
      console.log('No longer idle.');
      this.userIdle.watch();
      this.snackIdle.dismiss();
    });

  }

  ngOnInit() {
    console.log('loading layout');

    let menuItems = [] as SidenavItem[];

    // cargando el arbol de permisos
    const dashboardItem = {
      label: 'MENU',
      type: 'subheading',
      customClass: 'first-subheading'
    } as SidenavItem;

    menuItems.push(dashboardItem);
    this.navService.get().subscribe(data => {

      // console.log('loading menu', data);
      let r = data.map(el => { el.type = 'item'; return el; });
      this.sidenavService.items = [];
      this.sidenavService.addItems(menuItems.concat(r));
      this.sidenavService.getItemByRoute(this.router.url);
    });


    this.idleConfig()

  }

  openQuickPanel() {
    this.quickPanelOpen = true;
  }

  // openConfigPanel() {
  //   this.configPanel.open();
  // }

  closeSidenav() {
    this.sidenavService.close();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  ngOnDestroy(): void { }
}

