import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { MaterialRemesa } from 'src/@sirio/domain/services/control-efectivo/remesa.service';
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
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  apoderadoList:ReplaySubject<Apoderado[]> = new ReplaySubject<Apoderado[]>();
  
  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected apoderadoService: ApoderadoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.apoderadoService.allByPersonaId(this.persona).subscribe((data) => {
            
      this.apoderadoList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('apoderado table');
    
    if(this.persona){
      console.log('buscando apoderado en el servidor dado el id persona');
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
    //console.log('data event click ', data);

  }

  delete(row) {
    this.swalService.show('¿Desea Eliminar El Apoderado?', undefined,
    { 'html': ' <b>' + row.identificacion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          console.log('buscando apoderado',row.id);
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
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(ApoderadoFormPopupComponent, !data?{persona:this.persona}:data,'60%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}
}