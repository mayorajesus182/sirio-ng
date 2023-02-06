import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { CuentaBanco } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'sirio-p2p-telefono-table',
  templateUrl: './p2p-telefono-table.component.html',
  styleUrls: ['./p2p-telefono-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class P2PTelefonoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  constants = GlobalConstants;

  @Input() cuenta: CuentaBanco = undefined;

  telefonoList: ReplaySubject<Telefono[]> = new ReplaySubject<Telefono[]>();
  private principal: boolean = false;
  telefonos: Telefono[] = [];
  cantidadTelefonos: number = 0;
  selecteds:any[]=[];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected telefonoService: TelefonoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.telefonos = []

    this.telefonoService.allByPersonaId(this.cuenta.persona).subscribe(data => {
      console.log(data);


      this.cantidadTelefonos = data.length;
      this.telefonos = data;
      this.telefonoList.next(this.telefonos);
      this.principal = data.filter(d => d.principal == 1).length > 0;

      this.telefonos.map((t:any) => {
        t.afiliado = this.selecteds.includes(t.numero);
        return t;
      })


      this.cdr.detectChanges();
    });
  }

  ngOnInit() {

    console.log('Cuentaaa ', this.cuenta);
    const data = localStorage.getItem('selectedTelefonos');
    this.selecteds = data?JSON.parse(data):[];

    if (this.cuenta) {
      this.loadList();
    }
  }

  ngAfterViewInit() {

  }

  delete(row:any,numero:string) {
    this.swalService.show('¿Desea Desafiliar el Teléfono?', undefined,
      { 'html': ' <strong>' + numero + '</strong>' }).then((resp) => {
        if (!resp.dismiss) {
          // this.telefonoService.delete(row.id).subscribe(val => {
          //   if (val) {
          //     this.loadList();
          //   }
          // })

          row.afiliado=false;

          localStorage.setItem('selectedTelefonos', JSON.stringify(this.telefonos.filter((t:any) => t.afiliado).map(t => t.numero)));
          this.cdr.detectChanges();
        }
      });
  }

  afiliar(row: any,numero:string) {
    // if(data){
    // data.persona=this.persona;
    // } 
    
    this.swalService.show('¿Desea Afiliar el Teléfono?', undefined,
      { 'html': ' <strong>' + numero + '</strong>' }).then((resp) => {
        if (!resp.dismiss) {


          // cambio el estatus al que este afiliado
          this.telefonos.filter((t:any)=>t.afiliado).map((t:any)=>{
            t.afiliado=false;
            return t;
          })


          row.afiliado = true;
          // this.telefonoService.delete(row.id).subscribe(val => {
          //   if (val) {
          //     this.loadList();
          //   }
          // })
          localStorage.setItem('selectedTelefonos', JSON.stringify(this.telefonos.filter((t:any) => t.afiliado).map(t => t.numero)));
          this.cdr.detectChanges();
          this.successResponse('El telefono ', 'afiliado');
        }
      });


  }


}