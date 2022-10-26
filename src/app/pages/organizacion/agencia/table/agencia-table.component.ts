import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';

@Component({
  selector: 'app-agencia-table',
  templateUrl: './agencia-table.component.html',
  styleUrls: ['./agencia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class AgenciaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['agencia_id', 'nombre', 'horarioExt',  'activo', 'actions'];

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

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.agenciaService, data.element, data.element.nombre, this.cdr);
  }

}

