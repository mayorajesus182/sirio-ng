import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoRecaudoService } from 'src/@sirio/domain/services/configuracion/recaudo/tipo-recaudo.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-tipo-recaudo-table',
  templateUrl: './tipo-recaudo-table.component.html',
  styleUrls: ['./tipo-recaudo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoRecaudoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['tiprecaudo_id', 'tipdocumento_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private tipoRecaudoService: TipoRecaudoService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.tipoRecaudoService, 'tiprecaudo_id');
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
    this.applyChangeStatus(this.tipoRecaudoService, data.element, data.element.nombre, this.cdr);
  }

}

