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
import { Pais, PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';

@Component({
  selector: 'app-pais-table',
  templateUrl: './pais-table.component.html',
  styleUrls: ['./pais-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class PaisTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['pais_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private paisService: PaisService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.paisService, 'pais_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/pais/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/pais/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/pais/${element.id}/view`]);
  }

  activateOrInactivate(data: Pais) {
    this.applyChangeStatus(this.paisService, data, data.nombre, this.cdr);
  }

}

