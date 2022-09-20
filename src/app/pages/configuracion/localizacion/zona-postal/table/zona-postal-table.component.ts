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
import { ZonaPostal, ZonaPostalService } from 'app/shared/domain/services/configuracion/localizacion/zona.postal.service';

@Component({
  selector: 'app-zona-postal-table',
  templateUrl: './zona-postal-table.component.html',
  styleUrls: ['./zona-postal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class ZonaPostalTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['nombre', 'parroquia_id','municipio', 'estado' ,'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private zonaPostalService: ZonaPostalService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.zonaPostalService, 'zonpostal_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/zona/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/zona/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/zona/${element.id}/view`]);
  }

  activateOrInactivate(data: ZonaPostal) {
    this.applyChangeStatus(this.zonaPostalService, data, data.nombre, this.cdr);
  }

}

