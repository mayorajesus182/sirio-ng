import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ReferenciaBancaria } from 'src/@sirio/domain/services/persona/referencia-bancaria/referencia-bancaria.service';
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


  telefonos:string[]=[];

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
    this.telefonoService.allByPersonaId(this.persona).subscribe((data) => {

      this.telefonos= this.telefonos.concat(data.map(t=>t.numero));
     console.log(this.telefonos);
            
      this.telefonoList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('telefono table');
    
    if(this.persona){
      console.log('buscando telefono en el servidor dado el id persona');
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


  edit(data: Telefono) {
    //console.log('data event click ', data);

  }

  // delete(data: Telefono) {
  //   //console.log('data event click ', data);
  //   // if(data){

  //   // }
  // }

  delete(row) {
    this.swalService.show('¿Desea Eliminar El Teléfono?', undefined,
    { 'html': ' <b>' + row.numero + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          // console.log('buscando telefono',row.id);
          this.telefonoService.delete(row.id).subscribe(val=>{
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

  popup(data?:Telefono) {
    console.log(data);
    if(data){
      data.persona=this.persona;
      
    }    
    // this.showFormPopup(TelefonoFormPopupComponent, !data?{persona:this.persona,}:data,'40%').afterClosed().subscribe(event=>{

    this.showFormPopup(TelefonoFormPopupComponent, !data?{persona:this.persona,telefonos:this.telefonos}:{data,telefonos:this.telefonos},'40%').afterClosed().subscribe(event=>{
 // this.showFormPopup(ReferenciaBaPopupComponent, !data?{persona:this.persona,referencias:this.referencias}:data,'40%').afterClosed().subscribe(event=>{
      
      
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}