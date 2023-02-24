import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CifraPromedioService } from 'src/@sirio/domain/services/configuracion/cuenta-bancaria/cifra-promedio.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-cifra-promedio-table',
  templateUrl: './cifra-promedio-table.component.html',
  styleUrls: ['./cifra-promedio-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CifraPromedioTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['cifpromedio_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private cifraPromedioService: CifraPromedioService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.cifraPromedioService, 'cifpromedio_id');
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
    this.applyChangeStatus(this.cifraPromedioService, data.element, data.element.nombre, this.cdr);
  }

}

