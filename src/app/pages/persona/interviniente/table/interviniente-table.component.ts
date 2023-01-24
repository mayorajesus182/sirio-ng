import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
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


  @Input() cuenta = undefined;
  @Input() tipoFirma: FormControl = undefined;

  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  intervinienteList: ReplaySubject<Interviniente[]> = new ReplaySubject<Interviniente[]>();

  intervinientes: string[] = [];
  tipoFirmaCurr = '01';
  multipleFirmantes:boolean=false;

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

  private loadList() {
    this.intervinienteService.allByCuentaId(this.cuenta).subscribe((data) => {
      console.log(data);
      this.intervinientes = data.map(i => i.identificacion);// esto es para validar que no incluyan el mismo interviniente
      this.multipleFirmantes = data.filter(f=> f.tipoFirma!=GlobalConstants.TIPO_FIRMA_UNICA).length > 0;// verificar si la firma es conjunta o separada

      this.intervinienteList.next(data.slice());
      // this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {

    console.log('interviniente table');

    if (this.cuenta) {
      console.log('buscando interviniente en el servidor dado el id persona');
      this.loadList();

      this.onRefresh.subscribe(val => {
        if (val) {

          this.loadList();
        }
      })

      this.tipoFirma.valueChanges.subscribe(val => {
        console.log('val tipo firma ', val);

        if (val) {
          this.tipoFirmaCurr = val;
          this.cdr.detectChanges();
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
          console.log('buscando interviniente', row.id);
          this.intervinienteService.delete(row.cuenta, row.persona).subscribe(val => {
            if (val) {
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
      });
  }

  view(data: any) {


  }

  popup(data?: Interviniente) {
    // console.log(data);
    if (data) {
      data.cuenta = this.cuenta;
    }
    this.showFormPopup(IntervinienteFormPopupComponent, !data ? { cuenta: this.cuenta, intervinientes: this.intervinientes } : { ...data, ...{ intervinientes: this.intervinientes } }, '70%').afterClosed().subscribe(event => {
      // this.showFormPopup(ReferenciaPersonalFormPopupComponent, !data?{persona:this.persona,referencias:this.referencias}:{...data,...{referencias:this.referencias}},'40%').afterClosed().subscribe(event=>{

      if (event) {
        this.onRefresh.next(true);
      }
    });
  }
}