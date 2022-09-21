import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ApiConfConstants } from 'src/@sirio/constants';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-agencia-table',
  templateUrl: './agencia-table.component.html',
  styleUrls: ['./agencia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AgenciaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['codigo','nombre','zonaPostalNombre','ciudad', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private agenciaService: AgenciaService,
  ) {
    super(undefined,  injector);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.init(this.agenciaService, 'agencia_id');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }


  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    const term = value.toLowerCase();
    this.agenciaService.searchTerm.next(term);
  }


  add(path:string) {
    console.log(' apply add action '+path);
    
    this.router.navigate([`/${ApiConfConstants.APP_NAME}/${path}/add`]);
  }

  edit(element) {
    this.router.navigate([`/organizacion/agencia/${element.id}/edit`]);
  }

  view(element) {
    this.router.navigate([`/organizacion/agencia/${element.id}/view`]);
  }

  activateOrInactivate(data: Agencia) {
    this.applyChangeStatus(this.agenciaService, data, data.nombre, this.cdr);
  }

  
}

