import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PromedioTransaccion, PromedioTransaccionService } from 'src/@sirio/domain/services/configuracion/producto/promedio-transaccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-promedio-transaccion-table',
  templateUrl: './promedio-transaccion-table.component.html',
  styleUrls: ['./promedio-transaccion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PromedioTransaccionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['protransaccion_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private promedioTransaccionService: PromedioTransaccionService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.promedioTransaccionService, 'protransaccion_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {
    console.log(' apply add action '+path);
    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {
    console.log('data event click ', data);
    
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.promedioTransaccionService, data.element, data.element.nombre, this.cdr);
  }

}
