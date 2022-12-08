import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-procesar-remesa-table',
  templateUrl: './procesar-remesa-table.component.html',
  styleUrls: ['./procesar-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ProcesarRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'emisor', 'monto', 'moneda', 'estatus', 'actions'];
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
  this.init(this.remesaService, 'remesa_id', 'pagePorProcesar');
 } 

  ngOnInit() {
   this.loadList();
  }

  ngAfterViewInit() {
  }

  process(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/process`]);
  }

  dispatch(data: any) {
    this.swalService.show('¿Desea Despachar la Solicitud?', data.element.id).then((resp) => {
      if (!resp.dismiss) {
        this.remesaService.dispatch(data.element).subscribe(data => {
          this.successResponse('La Remesa', 'Procesada', false);
          this.loadList();
          return data;
      }, error => this.errorResponse(true));
      }
    });
  }
  
  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

}

