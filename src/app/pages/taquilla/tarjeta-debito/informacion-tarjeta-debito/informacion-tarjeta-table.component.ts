import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TarjetaDebitoConstants } from 'src/@sirio/constants';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { InformacionTarjetaFormPopupComponent } from '../popup/informacion-tarjeta-form.popup.component';
// import { TelefonoFormPopupComponent } from '../popup/telefono-form.popup.component';

@Component({
  selector: 'sirio-informacion-tarjeta',
  templateUrl: './informacion-tarjeta-table.component.html',
  styleUrls: ['./informacion-tarjeta-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class InformacionTarjetaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona: Persona = {} as Persona;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  cuentasBancarias:ReplaySubject<CuentaBancaria[]> = new ReplaySubject<CuentaBancaria[]>();
  // private principal: boolean = false;
  private principal: boolean = false;
  telefonos:string[]=[];
  cantidadTelefonos: number = 0;
  constante = TarjetaDebitoConstants;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private cuentaBancariaService: CuentaBancariaService,
    protected telefonoService: TelefonoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    // this.telefonos=[]  

    this.cuentaBancariaService.activesByNumper(this.persona.numper).subscribe(data => {
      this.cuentasBancarias.next(data);
      if (data.length === 1) {
        console.log("perreer", data);
        
          // this.f.numeroCuenta.setValue(data[0].id);
      }
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

reset() {
}

popup(row, option:string) {
    if(row && option){
      console.log( "correo electronico en Persona",this.persona);
      
      this.showFormPopup(InformacionTarjetaFormPopupComponent, {persona:this.persona, option:option},'65%').afterClosed().subscribe(event=>{
        console.log("persona", this.persona);
        
          if(event){
              this.onRefresh.next(true);
          }
      }); 
    }    

}

}