import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
// import { TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
// import { TipoServicioService } from 'src/@sirio/domain/services/configuracion/servicio-comercial.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-tipo-servicio-table',
  templateUrl: './tipo-servicio-table.component.html',
  styleUrls: ['./tipo-servicio-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoServicioTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['tipservicio_id', 'nombre', 'moneda_id', 'tippersona_id', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    // private tipoServicioService: TipoServicioService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    // this.init(this.tipoServicioService, 'tipservicio_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    // this.applyChangeStatus(this.tipoServicioService, data.element, data.element.nombre, this.cdr);
  }

}

