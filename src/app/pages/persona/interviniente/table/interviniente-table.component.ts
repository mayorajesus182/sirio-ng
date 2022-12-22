import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { IntervinienteFormPopupComponent } from '../popup/interviniente-form.popup.component';

@Component({
  selector: 'sirio-persona-interviniente-table',
  templateUrl: './interviniente-table.component.html',
  styleUrls: ['./interviniente-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class IntervinienteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  intervinienteList:ReplaySubject<Interviniente[]> = new ReplaySubject<Interviniente[]>();
  
  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected intervinienteService: IntervinienteService,
    private calendarioService: CalendarioService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.intervinienteService.allByPersonaId(this.persona).subscribe((data) => {
            
      this.intervinienteList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {

  

  
    console.log('interviniente table');
    
    if(this.persona){
      console.log('buscando interviniente en el servidor dado el id persona');
      this.loadList();

      this.onRefresh.subscribe(val=>{
        if(val){

          this.loadList();
        }
      })
    }
  }

  ngAfterViewInit() {

  }


  edit(data: Interviniente) {
    //console.log('data event click ', data);

  }

  delete(row) {
    this.swalService.show('¿Desea Eliminar El Interviniente?', undefined,
    { 'html': ' <b>' + row.identificacion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          console.log('buscando interviniente',row.id);
          this.intervinienteService.delete(row.id).subscribe(val=>{
            if(val){
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
    });
}

  view(data: any) {


  }

  popup(data?:Interviniente) {
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(IntervinienteFormPopupComponent, !data?{persona:this.persona}:data,'70%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}
}