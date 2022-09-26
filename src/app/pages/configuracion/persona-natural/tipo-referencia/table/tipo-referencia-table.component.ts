import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoReferenciaService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-referencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-tipo-referencia-table',
  templateUrl: './tipo-referencia-table.component.html',
  styleUrls: ['./tipo-referencia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class TipoReferenciaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['tipreferencia_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected tipoReferenciaService: TipoReferenciaService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.tipoReferenciaService, 'tipreferencia_id');
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
    this.applyChangeStatus(this.tipoReferenciaService, data.element, data.element.nombre, this.cdr);
  }

}

