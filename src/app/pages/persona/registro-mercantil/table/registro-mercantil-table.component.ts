import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegistroMercantil, RegistroMercantilService } from 'src/@sirio/domain/services/persona/registro-mercantil/registro-mercantil.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { RegistroMercantilFormPopupComponent } from '../popup/registro-mercantil-form.popup.component';

@Component({
  selector: 'sirio-persona-registro-mercantil-table',
  templateUrl: './registro-mercantil-table.component.html',
  styleUrls: ['./registro-mercantil-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class RegistroMercantilTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() tipoDocumento=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  registroMercantilList:ReplaySubject<RegistroMercantil[]> = new ReplaySubject<RegistroMercantil[]>();

  

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected registroMercantilService: RegistroMercantilService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }
  
  private loadList(){

    this.registroMercantilService.allByPersonaId(this.persona).subscribe((data) => {

      this.registroMercantilList.next(data.slice());
      this.cdr.detectChanges();
    });
  }
 
  ngOnInit() {

    if(this.persona){
      console.log('buscando Registro Mercantil en el servidor dado el id persona');
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

  popup(data?:any) {
    if(data){
      data.persona=this.persona;
      data.tipoDocumento = this.tipoDocumento;
    }    

    this.showFormPopup(RegistroMercantilFormPopupComponent, !data?{persona:this.persona, tipoDocumento:this.tipoDocumento}:data,'60%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}