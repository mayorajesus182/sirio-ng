import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';

@Component({
  selector: 'app-estado-table',
  templateUrl: './estado-table.component.html',
  styleUrls: ['./estado-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class EstadoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['estado_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected estadoService: EstadoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.estadoService, 'estado_id');
  }

  ngAfterViewInit() {
    this.afterInit();
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

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.estadoService, data.element, data.element.nombre, this.cdr);
  }

}

