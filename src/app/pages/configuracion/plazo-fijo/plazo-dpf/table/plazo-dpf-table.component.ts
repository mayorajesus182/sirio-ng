import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PlazoDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/plazo.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-plazo-dpf-table',
  templateUrl: './plazo-dpf-table.component.html',
  styleUrls: ['./plazo-dpf-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PlazoDPFTableComponent extends TableBaseComponent implements OnInit, AfterViewInit{

  displayedColumns = ['plazo_id', 'nombre', 'dias', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private plazoDPFService: PlazoDPFService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.plazoDPFService, 'plazo_id');
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
    this.applyChangeStatus(this.plazoDPFService, data.element, data.element.nombre, this.cdr);
  }

}

