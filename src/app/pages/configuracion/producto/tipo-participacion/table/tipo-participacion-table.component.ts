import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-tipo-participacion-table',
  templateUrl: './tipo-participacion-table.component.html',
  styleUrls: ['./tipo-participacion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoParticipacionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['tipparticipacion_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private tipoParticipacionService: TipoParticipacionService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.tipoParticipacionService, 'tipparticipacion_id');
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
    this.applyChangeStatus(this.tipoParticipacionService, data.element, data.element.nombre, this.cdr);
  }

}

