import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PlazoFijoService } from 'src/@sirio/domain/services/persona/plazo-fijo/plazo-fijo.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'app-plazo-fijo-table',
  templateUrl: './plazo-fijo-table.component.html',
  styleUrls: ['./plazo-fijo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class PlazoFijoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  public persona: Persona = {} as Persona;

  displayedColumns = ['plazofijo_id', 'fecha', 'monto', 'tipsubproducto_id', 'estplazofijo_id', 'actions'];


  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected plazoFijoService: PlazoFijoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.plazoFijoService, 'plazofijo_id');
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
    this.applyChangeStatus(this.plazoFijoService, data.element, data.element.fecha, this.cdr);
  }

  queryResult(event) {
    if (!event.id && !event.numper) {
        this.persona = {} as Persona;
        this.cdr.detectChanges();
    } else {
        this.persona = event;
    }
}

}

