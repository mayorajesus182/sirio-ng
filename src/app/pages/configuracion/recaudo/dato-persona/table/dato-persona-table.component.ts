import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { DatoPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/dato-persona.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-dato-persona-table',
  templateUrl: './dato-persona-table.component.html',
  styleUrls: ['./dato-persona-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DatoPersonaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['seccion_id', 'tippersona_id' , 'cantidad', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private datoPersonaService: DatoPersonaService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.datoPersonaService, 'seccion_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {    
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.tipoPersona}/${data.element.seccion}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {    
    this.applyChangeStatus(this.datoPersonaService, data.element, data.element.nombre, this.cdr);
  }

}

