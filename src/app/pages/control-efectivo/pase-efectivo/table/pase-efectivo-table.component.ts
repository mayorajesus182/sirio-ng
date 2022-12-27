import { formatNumber } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-pase-efectivo-table',
  templateUrl: './pase-efectivo-table.component.html',
  styleUrls: ['./pase-efectivo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['bovagencia_id', 'tipoMovimiento', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;

  contentStats:string='';

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private saldoAgenciaService: SaldoAgenciaService,
    private bovedaAgenciaService: BovedaAgenciaService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.bovedaAgenciaService, 'bovagencia_id');


    this.saldoAgenciaService.getSaldo().subscribe(data=>{

console.log(data);


      data.forEach(element => {
        
        this.contentStats+=`<strong>${element.moneda}</strong> <br>`;
        this.contentStats+=`<span class="line" ><i class="fas fa-down-to-dotted-line fa-lg icon-up"></i>&nbsp; ${ formatNumber(element.ingreso, 'es', '1.2')} &nbsp;&nbsp; `;
        this.contentStats+=`<i class="fas fa-up-to-dotted-line fa-lg icon-down"></i>&nbsp; ${ formatNumber(element.egreso, 'es', '1.2')} </span> <br>`;
      });
      
    });

  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.bovedaAgenciaService, data.element, data.element.nombre, this.cdr);
  }

}

