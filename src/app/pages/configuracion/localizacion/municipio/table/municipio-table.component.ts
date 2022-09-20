import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableBaseComponent } from 'app/shared/components/base/table-base.component';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { Municipio, MunicipioService } from 'app/shared/domain/services/configuracion/localizacion/municipio.service';


@Component({
  selector: 'app-municipio-table',
  templateUrl: './municipio-table.component.html',
  styleUrls: ['./municipio-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class MunicipioTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['municipio_id', 'nombre','estado_id', 'ciudad','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private municipioService: MunicipioService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.municipioService, 'municipio_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/municipio/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/municipio/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/municipio/${element.id}/view`]);
  }

  activateOrInactivate(data: Municipio) {
    this.applyChangeStatus(this.municipioService, data, data.nombre, this.cdr);
  }

}

