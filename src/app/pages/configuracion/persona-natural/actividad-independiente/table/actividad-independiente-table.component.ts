import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ActividadIndependienteService } from 'src/@sirio/domain/services/configuracion/persona-natural/actividad-independiente.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-actividad-independiente-table',
  templateUrl: './actividad-independiente-table.component.html',
  styleUrls: ['./actividad-independiente-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ActividadIndependienteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['actindependiente_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected actividadIndependienteService: ActividadIndependienteService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.actividadIndependienteService, 'actindependiente_id');
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
    this.applyChangeStatus(this.actividadIndependienteService, data.element, data.element.nombre, this.cdr);
  }

}

