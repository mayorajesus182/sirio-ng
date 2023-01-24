import { formatNumber } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RolConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { SaldoAcopioService } from 'src/@sirio/domain/services/control-efectivo/saldo-acopio.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoPrincipalService } from 'src/@sirio/domain/services/control-efectivo/saldo-principal.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'app-consultar-remesa-table',
  templateUrl: './consultar-remesa-table.component.html',
  styleUrls: ['./consultar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ConsultarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'tipo', 'emisor', 'receptor', 'monto', 'moneda', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;
  contentStats: string = '';

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private saldoAgenciaService: SaldoAgenciaService,
    private saldoAcopioService: SaldoAcopioService,
    private saldoPrincipalService: SaldoPrincipalService,
    private sessionService: SessionService,
    private remesaService: RemesaService,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {
    this.init(this.remesaService, 'remesa_id');

    const user = this.sessionService.getUser();

    if (user && user.username) {
      // console.log("Usuario ROLS", user);
      this.contentStats += `<span class="line" ><i class="fas fa-up-to-dotted-line fa-lg icon-up"></i>&nbsp; Ingresos &nbsp;&nbsp;`;
      this.contentStats += `<i class="fas fa-down-to-dotted-line fa-lg icon-down"></i>&nbsp; Egresos </span> <br>`;

      if (user.rols.includes(RolConstants.GERENTE_TESORERO_AGENCIA)) {

        this.saldoAgenciaService.getSaldoSinDetalle().subscribe(data => {
          data.forEach(element => {
            this.contentStats += `<strong>${element.moneda}</strong> <br>`;
            this.contentStats += `<span class="line" ><i class="fas fa-down-to-dotted-line fa-lg icon-up"></i>&nbsp; ${formatNumber(element.remesaRecibida, 'es', '1.2')} &nbsp;&nbsp; `;
            this.contentStats += `<i class="fas fa-up-to-dotted-line fa-lg icon-down"></i>&nbsp; ${formatNumber(element.remesaEnviada, 'es', '1.2')} </span> <br>`;
          });
        });

      } else if (user.rols.includes(RolConstants.PRINCIPAL)) {
        this.saldoPrincipalService.getSaldoSinDetalle().subscribe(data => {
          data.forEach(element => {
            this.contentStats += `<strong>${element.moneda}</strong> <br>`;
            this.contentStats += `<span class="line" ><i class="fas fa-down-to-dotted-line fa-lg icon-up"></i>&nbsp; ${formatNumber(element.remesaRecibida, 'es', '1.2')} &nbsp;&nbsp; `;
            this.contentStats += `<i class="fas fa-up-to-dotted-line fa-lg icon-down"></i>&nbsp; ${formatNumber(element.remesaEnviada, 'es', '1.2')} </span> <br>`;
          });
        });

      } else if (user.rols.includes(RolConstants.TRANSPORTISTA)) {
        this.saldoAcopioService.getSaldoSinDetalle().subscribe(data => {
          data.forEach(element => {
            this.contentStats += `<strong>${element.moneda}</strong> <br>`;
            this.contentStats += `<span class="line" ><i class="fas fa-down-to-dotted-line fa-lg icon-up"></i>&nbsp; ${formatNumber(element.remesaRecibida, 'es', '1.2')} &nbsp;&nbsp; `;
            this.contentStats += `<i class="fas fa-up-to-dotted-line fa-lg icon-down"></i>&nbsp; ${formatNumber(element.remesaEnviada, 'es', '1.2')} </span> <br>`;
          });
        });
      }
    }
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

}

