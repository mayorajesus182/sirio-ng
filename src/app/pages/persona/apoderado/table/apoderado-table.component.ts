import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Apoderado, ApoderadoService } from 'src/@sirio/domain/services/persona/apoderado/apoderado.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ApoderadoFormPopupComponent } from '../popup/apoderado-form.popup.component';

@Component({
  selector: 'sirio-persona-apoderado-table',
  templateUrl: './apoderado-table.component.html',
  styleUrls: ['./apoderado-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ApoderadoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() Tipopersona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  apoderadoList:ReplaySubject<Apoderado[]> = new ReplaySubject<Apoderado[]>();
  apoderados: string[] = [];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected apoderadoService: ApoderadoService,
    private calendarioService: CalendarioService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.apoderados = []
    this.apoderadoService.allByPersonaId(this.persona).subscribe((data) => {
      this.apoderadoList.next(data.slice());
      this.apoderados = this.apoderados.concat(data.map(t => t.identificacion));
      this.propagar.emit(data.length);
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

  ngAfterViewInit() {

  }


  edit(data: Apoderado) {
  }

  delete(row) {
    this.swalService.show('¿Desea Eliminar El Apoderado?', undefined,
    { 'html': ' <b>' + row.identificacion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.apoderadoService.delete(row.id).subscribe(val=>{
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

  popup(data?:Apoderado) {
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(ApoderadoFormPopupComponent, !data?{persona:this.persona, apoderados: this.apoderados ,Tipopersona:this.Tipopersona}:{ ...data, ...{ apoderados: this.apoderados } },'80%').afterClosed().subscribe(event=>{
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}
}
