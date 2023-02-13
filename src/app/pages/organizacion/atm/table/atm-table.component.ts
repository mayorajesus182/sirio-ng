import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { AtmReportService } from 'src/@sirio/domain/services/organizacion/atm.reports.service';
import { AtmService } from 'src/@sirio/domain/services/organizacion/atm.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { RolConstants } from 'src/@sirio/constants';
import { User } from 'src/@sirio/domain/services/security/auth.service';



@Component({
  selector: 'app-atm-table',
  templateUrl: './atm-table.component.html',
  styleUrls: ['./atm-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AtmTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {
  esGerente: Boolean = false;
  displayedColumns = ['atm_id', 'identificacion', 'moneda_id', 'tipatm_id', 'responsable', 'activo', 'actions'];
  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private atmService: AtmService,
    private atmReportService: AtmReportService,
    private sessionService: SessionService,
  ) {
    super(undefined,  injector);
  }

  ngOnInit() {
    this.init(this.atmService, 'fcreacion');
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

  boxes(data:any) { 
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/boxes`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  recount(data:any) {   // arqueo
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/recount`;


    console.log(data.element);
    
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  consult(data:any) { // consultar arqueo
    const url = `${this.buildPrefixPath(data.path)}${data.element.id}/consult`;
    this.router.navigateByUrl(url, { state: {data: data.element}  });
  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.atmService, data.element, data.element.nombre, this.cdr);
  }



  print(event) {
    if(event){
          
       this.atmReportService.atmreporte().subscribe(event => {        
           //this.loadingDataForm.next(false);
            const name = this.getFileName(event);
            let blob: any = new Blob([event.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });        
       
    }
   
    
  }

}


