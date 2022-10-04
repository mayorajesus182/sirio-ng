import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ViajeService } from 'src/@sirio/domain/services/transporte/viaje.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-viaje-table',
  templateUrl: './viaje-table.component.html',
  styleUrls: ['./viaje-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ViajeTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['viaje_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private viajeService: ViajeService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.viajeService, 'viaje_id');
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
    this.applyChangeStatus(this.viajeService, data.element, data.element.nombre, this.cdr);
  }

}

