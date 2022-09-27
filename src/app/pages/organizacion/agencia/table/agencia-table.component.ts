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

  displayedColumns = ['codigo', 'nombre', 'horarioExt',  'activo', 'actions'];

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
    this.init(this.agenciaService, 'codigo');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {
    console.log(' apply add action '+path);
    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {
    console.log('data event click ', data);
    
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.agenciaService, data.element, data.element.nombre, this.cdr);
  }

}

