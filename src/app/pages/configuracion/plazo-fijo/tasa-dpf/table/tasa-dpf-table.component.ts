import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TasaDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tasa-dpf.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-tasa-dpf-table',
  templateUrl: './tasa-dpf-table.component.html',
  styleUrls: ['./tasa-dpf-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TasaDPFTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['tasa_id', 'tiptasa_id', 'porcentaje', 'tipsubproducto_id', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private tasaDPFService: TasaDPFService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.tasaDPFService, 'tasa_id');
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
    this.applyChangeStatus(this.tasaDPFService, data.element, data.element.nombre, this.cdr);
  }

}

