import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { DireccionService } from 'src/@sirio/domain/services/persona/direccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'app-direccion-table',
  templateUrl: './direccion-table.component.html',
  styleUrls: ['./direccion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class DireccionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id','persona','tipoDireccion','parroquia', 'zonaPostal','via','nombreVia','nucleo','nombreNucleo', 'construccion','estadonombreCostruccion', 'referencia',];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected direccionService: DireccionService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.direccionService, 'id');
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
    this.applyChangeStatus(this.direccionService, data.element, data.element.nombre, this.cdr);
  }

}