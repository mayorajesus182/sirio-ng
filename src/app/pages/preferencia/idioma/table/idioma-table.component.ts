import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { Idioma, IdiomaService } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { ApiConfConstants } from 'src/@sirio/constants';

@Component({
  selector: 'sirio-idioma-table',
  templateUrl: './idioma-table.component.html',
  styleUrls: ['./idioma-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class IdiomaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['idioma_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private idiomaService: IdiomaService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.idiomaService, 'idioma_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add(path:string) {
    console.log(' apply add action '+path);
    
    this.router.navigate([`/${ApiConfConstants.APP_NAME}/${path}/add`]);
  }

  edit(path:string,element) {
    this.router.navigate([`${path}/${element.id}/edit`]);
  }

  view(path:string,element) {
    this.router.navigate([`${path}/${element.id}/view`]);
  }

  activateOrInactivate(path:string,element: Idioma) {
    this.applyChangeStatus(this.idiomaService, element, element.nombre, this.cdr);
  }


  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    const term = value.toLowerCase();
    this.idiomaService.searchTerm.next(term);
  }

}

