import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { TableBaseComponent } from 'app/shared/components/base/table-base.component';
import { Estado, EstadoService } from 'app/shared/domain/services/configuracion/localizacion/estado.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-estado-table',
  templateUrl: './estado-table.component.html',
  styleUrls: ['./estado-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class EstadoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['estado_id', 'nombre', 'pais_id', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private estadoService: EstadoService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.estadoService, 'estado_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/estado/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/estado/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/estado/${element.id}/view`]);
  }

  activateOrInactivate(data: Estado) {
    this.applyChangeStatus(this.estadoService, data, data.nombre, this.cdr);
  }

}

