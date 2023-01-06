import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { AtmService } from 'src/@sirio/domain/services/organizacion/atm.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-arqueo-atm-table',
  templateUrl: './arqueo-atm-table.component.html',
  styleUrls: ['./arqueo-atm-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ArqueoAtmTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['atm_id', 'identificacion', 'moneda_id', 'tipatm_id', 'responsable', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private atmService: AtmService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.atmService, 'atm_id', 'pageByAgencia');
  }

  ngAfterViewInit() {
    this.afterInit();
  }


  add(data:any) {   
    // this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/add`]);
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/add`;


    console.log(data.element);
    

    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  boxes(data:any) { 
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/boxes`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  view(data:any) {
    // this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/view`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.atmService, data.element, data.element.nombre, this.cdr);
  }

}

