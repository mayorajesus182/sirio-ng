import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { TableBaseComponent } from 'app/shared/components/base/table-base.component';
import { Via, ViaService } from 'app/shared/domain/services/configuracion/localizacion/via.service';
import { NavigationService } from 'app/shared/services/navigation.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-via-table',
  templateUrl: './via-table.component.html',
  styleUrls: ['./via-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class ViaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['via_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private viaService: ViaService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.viaService, 'via_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/via/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/via/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/via/${element.id}/view`]);
  }

  activateOrInactivate(data: Via) {
    this.applyChangeStatus(this.viaService, data, data.nombre, this.cdr);
  }

}

