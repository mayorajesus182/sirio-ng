import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { TableBaseComponent } from 'app/shared/components/base/table-base.component';
import { Nucleo, NucleoService } from 'app/shared/domain/services/configuracion/localizacion/nucleo.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nucleo-table',
  templateUrl: './nucleo-table.component.html',
  styleUrls: ['./nucleo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class NucleoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['nucleo_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private nucleoService: NucleoService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.nucleoService, 'nucleo_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/nucleo/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/nucleo/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/nucleo/${element.id}/view`]);
  }

  activateOrInactivate(data: Nucleo) {
    this.applyChangeStatus(this.nucleoService, data, data.nombre, this.cdr);
  }

}

