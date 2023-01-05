import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CondicionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/condicion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-condicion-table',
  templateUrl: './condicion-table.component.html',
  styleUrls: ['./condicion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CondicionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['condicion_id', 'nombre','activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private condicionService: CondicionService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.condicionService, 'condicion_id');
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
    this.applyChangeStatus(this.condicionService, data.element, data.element.nombre, this.cdr);
  }

}

