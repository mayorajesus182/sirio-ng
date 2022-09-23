import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Idioma, IdiomaService } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'sirio-idioma-table',
  templateUrl: './idioma-table.component.html',
  styleUrls: ['./idioma-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class IdiomaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['idioma_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private idiomaService: IdiomaService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.idiomaService, 'idioma_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {
    console.log(' apply add action '+path);
    
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data) {
    console.log('data event click ', data);
    
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.idiomaService, data.element, data.element.nombre, this.cdr);
  }



}

