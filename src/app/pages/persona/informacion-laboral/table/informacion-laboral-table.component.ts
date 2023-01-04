import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
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
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  informacionLaboralList:ReplaySubject<InformacionLaboral[]> = new ReplaySubject<InformacionLaboral[]>();

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
    this.informacionLaboralService.allByPersonaId(this.persona).subscribe((data) => {
           
      this.informacionLaboralList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('informacionLaboral table');
    
    if(this.persona){
      console.log('buscando Informacion Laboral en el servidor dado el id persona');
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
          // console.log('buscando telefono',row.id);
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
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(InformacionLaboralFormPopupComponent, !data?{persona:this.persona}:data,'50%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}