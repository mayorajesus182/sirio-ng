import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';

@Component({
  selector: 'app-tareas-table',
  templateUrl: './tareas-table.component.html',
  styleUrls: ['./tareas-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class TareasTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['agencia_id', 'nombre', 'region_id', 'horario_extendido',  'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected agenciaService: AgenciaService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.agenciaService, 'agencia_id');
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

  assign(data:any) {
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/assign`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  balance(data:any) {
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/balance`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  checkbalance(data:any) {
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/check`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.agenciaService, data.element, data.element.nombre, this.cdr);
  }

}

