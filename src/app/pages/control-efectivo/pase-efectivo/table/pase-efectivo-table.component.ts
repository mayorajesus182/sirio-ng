import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-pase-efectivo-table',
  templateUrl: './pase-efectivo-table.component.html',
  styleUrls: ['./pase-efectivo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['bovagencia_id', 'tipoMovimiento', 'egreso', 'ingreso', 'estatus', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private bovedaAgenciaService: BovedaAgenciaService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.bovedaAgenciaService, 'bovagencia_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  // edit(data:any) {    
  //   this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  // }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.bovedaAgenciaService, data.element, data.element.nombre, this.cdr);
  }

}

