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

  test: string;
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


  add() {
    // /inventario/articulos/add

    this.router.navigate(['/autorizacion/perfil/add']);



  }

  edit(element) {
    // /inventario/articulos/add

    this.router.navigate([`/autorizacion/perfil/${element.id}/edit`]);
  }

  // view(element) {
  //   // /inventario/articulos/add
  //   this.router.navigate([`/autorizacion/perfiles/${element.id}/view`]);
  //   // this.router.navigate([`/inventario/articulos/${element.id}/edit`])
  // }


  activateOrInactivate(element: Perfil) {

    if (!element || !element.id) {
      return;
    }

    // console.log(element)
    this.applyChangeStatus(this.perfilService, element, element.nombre, this.cdr);
  }

}

