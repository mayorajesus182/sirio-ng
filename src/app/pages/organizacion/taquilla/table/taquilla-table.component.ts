import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-taquilla-table',
  templateUrl: './taquilla-table.component.html',
  styleUrls: ['./taquilla-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TaquillaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['nombre', 'usuario_id','abierta', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private taquillaService: TaquillaService,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {
    this.init(this.taquillaService, 'nombre');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path: string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data: any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data: any) {
    data.element.usuario = undefined;
    this.applyChangeStatus(this.taquillaService, data.element, data.element.nombre, this.cdr);
  }

  // TODO: REVISAR ETIQUETAS
  open(data: any) {
    this.swalService.show('¿Desea Abrir La Taquilla Para La Jornada De Hoy?', undefined, { 'html': data.element.nombre + '<br/> Asignada a: ' + data.element.usuario }).then((resp) => {
      if (!resp.dismiss) {

        this.taquillaService.open(data.element.id).subscribe(result => {
          this.snack.show({ message: 'Taquilla Abierta Exitosamente Para La Jornada!', verticalPosition: 'bottom' });
          data.element.abierta = 1;
          this.cdr.detectChanges();
        });
      }
    })

  }

}

