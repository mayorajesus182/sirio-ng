import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RemesaService } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-solicitud-remesa-table',
  templateUrl: './solicitud-remesa-table.component.html',
  styleUrls: ['./solicitud-remesa-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitudRemesaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['remesa_id', 'transportista_id', 'estatus', 'actions'];
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

  ngOnInit() {
      this.init(this.remesaService, 'remesa_id');
  }

  ngAfterViewInit() {
    //  this.afterInit();
  }


  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  process(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/process`]);
  }

  dispatch(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/dispatch`]);
  }

  receive(data:any) {
    console.log('toyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
    
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/receive`]);
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data: any) {
    this.applyChangeStatus(this.remesaService, data.element, data.element.nombre, this.cdr);
  }

}

