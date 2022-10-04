import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';



@Component({
  selector: 'app-transportista-table',
  templateUrl: './transportista-table.component.html',
  styleUrls: ['./transportista-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TransportistaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['transportista_id', 'nombre', 'activo', 'actions'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private transportistaService: TransportistaService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.transportistaService, 'transportista_id');
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

  employee(data:any) { 
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/employee`;
    console.log('url ',url);
    

    this.router.navigateByUrl(url, { state: {data: data.element}  });
    // this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/employee`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.transportistaService, data.element, data.element.nombre, this.cdr);
  }

}

