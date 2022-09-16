import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarDirective } from '../shared/sidebar/sidebar.directive';
import { SidenavService } from './sidenav/sidenav.service';
import { filter, map, startWith } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from '../utils/check-router-childs-data';
import { UserIdleService } from 'angular-user-idle';

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
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.scrollDisabled))
  );

  constructor(
    private userIdle: UserIdleService,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log('timer ',count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => console.log('Time is up!'));

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

