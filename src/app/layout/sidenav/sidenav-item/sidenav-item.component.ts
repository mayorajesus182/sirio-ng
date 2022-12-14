import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidenavService } from '../sidenav.service';
import { SidenavItem } from './sidenav-item.interface';
import isFunction from 'lodash-es/isFunction';
import { CantidadRemesa } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { PermisoRemeseConstants } from 'src/@sirio/constants';

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
  @Input('badge') badge: CantidadRemesa;

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
    if (this.item && this.badge) {
      this.item.badgeColor = '#00acc1'
      // console.log('item id', this.item.id);
      switch (this.item.id) {
        case PermisoRemeseConstants.APROBAR:
          this.item.badge = this.badge.porAprobar;
          break;
        case PermisoRemeseConstants.PROCESAR_1:
          this.item.badge = this.badge.porAprobar;
          break;
        case PermisoRemeseConstants.PROCESAR_2:
          this.item.badge = this.badge.porAprobar;
          break;
        case PermisoRemeseConstants.ENVIAR:
          this.item.badge = this.badge.porEnviar;
          break;
        case PermisoRemeseConstants.RECIBIR:
          this.item.badge = this.badge.porRecibir;
          break;
        case PermisoRemeseConstants.SOLICITAR:
          this.item.badge = this.badge.solicitadas;
          break;

        default:
          break;
      }

      // if (this.item.badge) {

      //   // console.log('item badge', this.item);
      // }


    }
  }

  isFunction(routeOrFunction: string[] | Function) {
    return isFunction(routeOrFunction);
  }

  handleClick() {
    // console.log('handle click navigation sidenav');
    if (this.item.subpermisos && this.item.subpermisos.length > 0) {
      this.sidenavService.toggleItemOpen(this.item);
    } else if (typeof this.item.view === 'string') {
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
