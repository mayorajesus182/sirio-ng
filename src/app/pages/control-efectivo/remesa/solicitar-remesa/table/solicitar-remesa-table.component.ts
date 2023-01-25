import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'app-solicitar-remesa-table',
  templateUrl: './solicitar-remesa-table.component.html',
  styleUrls: ['./solicitar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

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
    this.init(this.remesaService, 'remesa_id', 'pageSolicitudes');
  }

  ngOnInit() {
    this.loadList();
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  // process(data:any) {
  //   this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/process`]);
  // }

  // dispatch(data:any) {
  //   this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/dispatch`]);
  // }

  // receive(data:any) {  
  //   this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/receive`]);
  // }

  override(data: any) {
    this.swalService.show('¿Desea Anular la Solicitud de Remesa?', data.element.id).then((resp) => {
      if (!resp.dismiss) {
        this.remesaService.cancelRequest(data.element).subscribe(data => {
          this.loadList();
          this.successResponse('La Remesa', 'Anulada', false);
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }


}

