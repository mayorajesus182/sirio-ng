import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-enviar-remesa-table',
  templateUrl: './enviar-remesa-table.component.html',
  styleUrls: ['./enviar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EnviarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'receptor', 'monto', 'moneda', 'estatus', 'actions'];
  aprobado = GlobalConstants.APROBADO;
  isOpen: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private remesaService: RemesaService,
  ) {
    super(undefined, injector);
  }

  loadList() {
    this.init(this.remesaService, 'remesa_id', 'pagePorDespachar');
  }

  ngOnInit() {
    this.loadList();
  }

  ngAfterViewInit() {
  }

  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  // dispatch(data: any) {
  //   this.swalService.show('¿Desea Despachar la Solicitud?', '').then((resp) => {
  //     if (!resp.dismiss) {
  //       this.remesaService.dispatch(data.element).subscribe(data => {
  //         this.successResponse('La Remesa', 'Procesada', false);
  //         this.loadList();
  //         return data;
  //       }, error => this.errorResponse(true));
  //     }
  //   });
  // }

  dispatch(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/dispatch`]);
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

}

