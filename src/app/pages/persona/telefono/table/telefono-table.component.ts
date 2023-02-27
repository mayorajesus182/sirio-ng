import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { TelefonoFormPopupComponent } from '../popup/telefono-form.popup.component';

@Component({
  selector: 'sirio-persona-telefono-table',
  templateUrl: './telefono-table.component.html',
  styleUrls: ['./telefono-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class TelefonoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  telefonoList:ReplaySubject<Telefono[]> = new ReplaySubject<Telefono[]>();
  private principal: boolean = false;
  telefonos:string[]=[];
  cantidadTelefonos: number = 0;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected telefonoService: TelefonoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.telefonos=[]  

    this.telefonoService.allByPersonaId(this.persona).subscribe((data) => {
      this.cantidadTelefonos = data.length;
      this.telefonos= this.telefonos.concat(data.map(t=>t.numero));            
      this.telefonoList.next(data.slice());
      this.principal = data.filter(d => d.principal == 1).length > 0;
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

  delete(row) {
    this.swalService.show('¿Desea Eliminar El Teléfono?', undefined,
    { 'html': ' <b>' + row.numero + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.telefonoService.delete(row.id).subscribe(val=>{
            if(val){
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
    });
}

  popup(data?:Telefono) {
    if(data){
      data.persona=this.persona;
    }    

    this.showFormPopup(TelefonoFormPopupComponent, !data?{persona:this.persona,telefonos:this.telefonos, principal: this.principal }:{data,telefonos:this.telefonos, principal: this.principal},'40%').afterClosed().subscribe(event=>{
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}