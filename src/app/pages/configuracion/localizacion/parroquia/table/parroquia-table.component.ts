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
import { Parroquia, ParroquiaService } from 'app/shared/domain/services/configuracion/localizacion/parroquia.service';


@Component({
  selector: 'app-parroquia-table',
  templateUrl: './parroquia-table.component.html',
  styleUrls: ['./parroquia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: appAnimations
})

export class ParroquiaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['parroquia_id', 'nombre', 'municipio_id', 'pais_id', 'estado_id','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected snack: SnackbarService,
    protected navService: NavigationService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    protected swalService: SweetAlertService,
    private parroquiaService: ParroquiaService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.parroquiaService, 'parroquia_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add() {
    this.router.navigate(['/configuracion/parroquia/add']);
  }

  edit(element) {
    this.router.navigate([`/configuracion/parroquia/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/configuracion/parroquia/${element.id}/view`]);
  }

  activateOrInactivate(data: Parroquia) {
    this.applyChangeStatus(this.parroquiaService, data, data.nombre, this.cdr);
  }

}

