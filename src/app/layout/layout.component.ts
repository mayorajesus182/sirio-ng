import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, DocumentInterruptSource, Idle, StorageInterruptSource } from '@ng-idle/core';

import { filter, map } from 'rxjs/operators';
import { GlobalConstants } from 'src/@sirio/constants';
import { SessionService } from 'src/@sirio/services/session.service';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { IdleWarningComponent } from 'src/@sirio/shared/idle-snack/idle-warning.component';
import { NavigationService } from '../../@sirio/services/navigation.service';
import { ThemeService } from '../../@sirio/services/theme.service';
import { checkRouterChildsData } from '../../@sirio/utils/check-router-childs-data';
import { SidenavItem } from './sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav/sidenav.service';



@Component({
  selector: 'sirio-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  
    private createCustomInterruptSources = [
        new DocumentInterruptSource('keydown mousedown mouseup touchstart touchmove scroll', null),
        new StorageInterruptSource(null)
    ];
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
    private snack: SnackbarService,
    private sessionService: SessionService,
    private matDialogRef: MatDialog,
    private router: Router) {

  }


  private idleConfig(): void {

    // sets an idle 15min seconds.
    this.userIdle.setIdle(GlobalConstants.TIMEOUT_IDLE);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.userIdle.setTimeout(GlobalConstants.IDLE_TIMEOUT);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.userIdle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    // this.userIdle.setInterrupts(this.createCustomInterruptSources);

    this.userIdle.watch();

    this.userIdle.onTimeout.subscribe(() => {

      this.snackIdle.dismiss();
      console.log('Timed out!');

      this.matDialogRef.closeAll();
      this.sessionService.lockscreen();
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

    const broadcast = new BroadcastChannel('sirio')
    broadcast.postMessage('I am First');
    broadcast.onmessage = (event) => {
      if (event.data === "I am First") {
        broadcast.postMessage(`Sorry! Already open`);
        console.log("First Tab");
      }
      if (event.data === `Sorry! Already open`) {
        console.log("Duplicate Tab");
        // this.router.navigate(['/user/login'])
      }
    };

    let menuItems = [] as SidenavItem[];

    // cargando el arbol de permisos
    const dashboardItem = {
      label: 'MENÚ',
      type: 'subheading',
      customClass: 'first-subheading text-menu'
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

