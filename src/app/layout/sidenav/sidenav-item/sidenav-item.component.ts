import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidenavService } from '../sidenav.service';
import { SidenavItem } from './sidenav-item.interface';
import isFunction from 'lodash-es/isFunction';

@Component({
  selector: 'sirio-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  animations: [
    trigger('dropdownOpen', [
      state('false', style({
        height: 0
      })),
      state('true', style({
        height: '*'
      })),
      transition('false <=> true', animate('300ms cubic-bezier(.35, 0, .25, 1)'))
    ])
  ]
})
export class SidenavItemComponent implements OnInit {

  @Input('item') item: SidenavItem;
  @Input('level') level: number;

  isCollapsed$ = this.sidenavService.collapsed$;
  dropdownOpen$: Observable<boolean>;

  constructor(private sidenavService: SidenavService, private router: Router) {
    this.dropdownOpen$ = this.sidenavService.currentlyOpen$.pipe(
      map(currentlyOpen => this.item.subpermisos && this.item.subpermisos.length > 0 && currentlyOpen.indexOf(this.item) > -1)
    );
  }

  get levelClass() {
    return `level-${this.level}`;
  }

  ngOnInit() {
  }

  isFunction(routeOrFunction: string[] | Function) {
    return isFunction(routeOrFunction);
  }

  handleClick() {
    // console.log('handle click navigation sidenav');
    if (this.item.subpermisos && this.item.subpermisos.length > 0) {
      this.sidenavService.toggleItemOpen(this.item);
    } else if (typeof this.item.view === 'string' ) {
      this.router.navigate([this.item.view]);
    } else {
      throw Error('Could not determine what to do, Sidenav-Item has no routeOrFunction set AND does not contain any subitems');
    }
  }

  getTextIcon(item: SidenavItem) {
    let result = '';

    if (item) {
      const name = item.label.split(' ');

      if (name.length > 0) {
        result += name[0].charAt(0).toUpperCase();
      }

      if (name.length > 1) {
        result += name[1].charAt(0).toLowerCase();
      }

      if (name.length === 1) {
        result += name[0].charAt(1).toLowerCase();
      }
    }

    return result;
  }
}
