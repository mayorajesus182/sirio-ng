import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-profesion-table',
  templateUrl: './profesion-table.component.html',
  styleUrls: ['./profesion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ProfesionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['profesion_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected profesionService: ProfesionService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.profesionService, 'profesion_id');
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
    this.applyChangeStatus(this.profesionService, data.element, data.element.nombre, this.cdr);
  }

}

