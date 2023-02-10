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
  selector: 'sirio-tarjeta-table',
  templateUrl: './tarjeta-table.component.html',
  styleUrls: ['./tarjeta-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class TarjetaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  constants = GlobalConstants;

  @Input() cuenta: CuentaBanco = undefined;

  tarjetaList: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  tarjetas: any[] = [
    { numero: '5899416754915768', tipo: 'MAESTRO CLASICA ', asociada: false },
    { numero: '5899416765205001', tipo: 'MAESTRO CLASICA ', asociada: false },
    { numero: '5899415275859646', tipo: 'MAESTRO CLASICA ', asociada: false },
    { numero: '5899416764939477', tipo: 'MAESTRO CLASICA ', asociada: false },
    { numero: '5899416765561296', tipo: 'MAESTRO MODERNA', asociada: false },
    { numero: '5899416751905697', tipo: 'MAESTRO DORADA', asociada: false },
    { numero: '5899416749534401', tipo: 'MAESTRO DORADA', asociada: false },
  ];

  selecteds: any[] = [];


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



    this.tarjetaList.next(this.tarjetas.map(t => {
      t.asociada = this.selecteds.includes(t.numero);
      return t;
    }));
    // .filter(t=>!this.selecteds.map(t=>t.numero).includes(t.numero)

    // this.telefonoService.allByPersonaId(this.cuenta.persona).subscribe(data => {
    //   console.log(data);

    //   this.telefonos = this.telefonos.concat(data.map(t => t.numero));
    //   this.tarjetaList.next(data.slice());
    //   this.principal = data.filter(d => d.principal == 1).length > 0;
    //   this.cdr.detectChanges();
    // });
  }

  ngOnInit() {

    console.log('Cuentaaa ', this.cuenta);
    const data = localStorage.getItem('selectedTarjetas');
    this.selecteds = data ? JSON.parse(data) : [];

    if (this.cuenta) {
      this.loadList();
    }
  }

  ngAfterViewInit() {

  }

  delete(row: any, numero: string) {
    this.swalService.show('¿Desea Desasociar la Tarjeta?', undefined,
      { 'html': ' <strong>' + numero + '</strong>' }).then((resp) => {
        if (!resp.dismiss) {
          // this.telefonoService.delete(row.id).subscribe(val => {
          //   if (val) {
          //     this.loadList();
          //   }
          // })          
          row.asociada = false;
          localStorage.setItem('selectedTarjetas', JSON.stringify(this.tarjetas.filter(t => t.asociada).map(t => t.numero)));
          this.cdr.detectChanges();
        }
      });
  }

  afiliar(row: any, numero: string) {
    // if(data){
    // data.persona=this.persona;
    // } 

    this.swalService.show('¿Desea Asignar la Tarjeta de Débito?', undefined,
      { 'html': ' <strong>' + numero + '</strong>' }).then((resp) => {
        if (!resp.dismiss) {


          // cambio el estatus al que este afiliado
          this.tarjetas.filter((t: any) => t.asociada).map((t: any) => {
            t.asociada = false;
            return t;
          })


          row.asociada = true;
          // this.telefonoService.delete(row.id).subscribe(val => {
          //   if (val) {
          //     this.loadList();
          //   }
          // })
          localStorage.setItem('selectedTarjetas', JSON.stringify(this.tarjetas.filter(t => t.asociada).map(t => t.numero)))
          this.cdr.detectChanges();
          this.successResponse('La tarjeta ', 'asociada');
        }
      });


  }


}