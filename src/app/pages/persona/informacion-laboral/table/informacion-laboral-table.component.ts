import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TipoIngresoConstants } from 'src/@sirio/constants';
import { InformacionLaboral, InformacionLaboralService } from 'src/@sirio/domain/services/persona/informacion-laboral/informacion-laboral.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

import { InformacionLaboralFormPopupComponent } from '../popup/informacion-laboral-form.popup.component';

@Component({
  selector: 'sirio-persona-informacionLaboral-table',
  templateUrl: './informacion-laboral-table.component.html',
  styleUrls: ['./informacion-laboral-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class InformacionLaboralTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  @Output('hasOwnBusiness') negocio: EventEmitter<boolean> = new EventEmitter<boolean>();
  informacionLaboralList:ReplaySubject<InformacionLaboral[]> = new ReplaySubject<InformacionLaboral[]>();

  informacionLaborales: any[] = [];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected informacionLaboralService: InformacionLaboralService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }
  
  private loadList(){

    this.informacionLaborales = []


    this.informacionLaboralService.allByPersonaId(this.persona).subscribe((data) => {
      console.log(data);
      
      this.informacionLaboralList.next(data.slice());
      console.log(data.filter(i=>i.tipoIngreso==TipoIngresoConstants.NEGOCIO_PROPIO).map(i=>i.id!=undefined)[0]);
      
      const hasOwnBusiness =data.filter(i=>i.tipoIngreso==TipoIngresoConstants.NEGOCIO_PROPIO).map(i=>i.id!=undefined)[0];

      this.negocio.emit(hasOwnBusiness);

      this.informacionLaborales = data.map(t => {return {identificacion:t.tipoDocumento+'-'+t.identificacion,tipo:t.tipoIngreso}});
      
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {    
    if(this.persona){
      this.loadList();
      this.onRefresh.subscribe(val=>{
        if(val){
          this.loadList();
        }
      })
    }
  }

  delete(row) {
    this.swalService.show('¿Desea Eliminar Información Laboral?', undefined,
      { 'html': ' <b>' + row.tipoIngreso +' : ' + row.nombre + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.informacionLaboralService.delete(row.id).subscribe(val=>{
            if(val){
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
    });
}

  ngAfterViewInit() {

  }

  popup(data?:InformacionLaboral) {
    if(data){
      data.persona=this.persona;
    }    
    // this.showFormPopup(InformacionLaboralFormPopupComponent, !data?{persona:this.persona}:data,'50%').afterClosed().subscribe(event=>{

        this.showFormPopup(InformacionLaboralFormPopupComponent, !data?{persona:this.persona, informacionLaborales: this.informacionLaborales } : { ...data, ...{ informacionLaborales: this.informacionLaborales } }, '50%').afterClosed().subscribe(event => {
   
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}
}