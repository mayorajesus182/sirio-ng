import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';


import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Perfil, PerfilService } from 'src/@sirio/domain/services/autorizacion/perfil.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';


@Component({
  selector: 'app-perfil-table',
  templateUrl: './perfil-table.component.html',
  styleUrls: ['./perfil-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class PerfilTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  unsubscribeAll: Subject<any>;
  displayedColumns = ['perfil_id', 'nombre', 'descripcion', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private perfilService: PerfilService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.init(this.perfilService, 'perfil_id');

  }


  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {

  }


  add(path:string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  // view(element) {
  //   // /inventario/articulos/add
  //   this.router.navigate([`/autorizacion/perfiles/${element.id}/view`]);
  //   // this.router.navigate([`/inventario/articulos/${element.id}/edit`])
  // }


  activateOrInactivate(data:any) {

    if (!data.element || !data.element.id) {
      return;
    }

    this.applyChangeStatus(this.perfilService, data.element, data.element.nombre, this.cdr);
  }

}

