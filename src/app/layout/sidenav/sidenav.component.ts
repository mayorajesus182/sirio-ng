import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav.service';
import { ThemeService } from '../../../@sirio/services/theme.service';
import { SessionService } from 'src/@sirio/services/session.service';

@Component({
  selector: 'sirio-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  sidenavUserVisible$ = this.themeService.config$.pipe(map(config => config.sidenavUserVisible));

  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean;

  @Input()
  @HostBinding('class.expanded')
  expanded: boolean;

  items$: Observable<SidenavItem[]>;

  fullName: string;
  officeName: string;
  logonedAt: any;

  constructor(private router: Router,
    private sessionService: SessionService,
    private sidenavService: SidenavService,
    private themeService: ThemeService) {
  }

  ngOnInit() {
    this.items$ = this.sidenavService.items$

    const data = this.sessionService.getUser();

    if (data && data.username) {
      console.log("User session", data);
      this.officeName = data.organizationId;
      this.fullName = data.fullName.split(" ")[0];
      this.logonedAt = data.prevLogin;
      // this.cdr.markForCheck();
    }

  }

  toggleCollapsed() {
    this.sidenavService.toggleCollapsed();
  }

  @HostListener('mouseenter')
  @HostListener('touchenter')
  onMouseEnter() {
    this.sidenavService.setExpanded(true);
  }

  @HostListener('mouseleave')
  @HostListener('touchleave')
  onMouseLeave() {
    this.sidenavService.setExpanded(false);
  }

  ngOnDestroy() {
  }
}
