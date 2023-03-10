import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CashFormPopupComponent } from 'src/@sirio/components/cash/popup/cash-form.popup.component';
import { GlobalConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';


import { fadeInRightAnimation } from '../../../@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../../@sirio/animations/fade-in-up.animation';

import { DireccionFormPopupComponent } from './form-dialog/direccion-form.popup.component';

@Component({
  selector: 'sirio-help-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})
export class HelpComponentsComponent implements OnInit {
  public conoActual: ConoMonetario[] = [];
  public conoAnterior: ConoMonetario[] = [];
  todayValue: Moment
  private _gap = 16;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;
  hasBasicData = true;
  isNew = true;
  tipoPersona:string='N';


  // moneda: Moneda = {
  //   id: 'USD',
  //   nombre: 'DOLARES'
  // } as Moneda;

  moneda: Moneda = {
    id: 'VED',
    nombre: 'BOLIVARES'
  } as Moneda;


  frutasList: any[] = [
    {
      id: 'P',
      nombre: 'Peras'
    },
    {
      id: 'F',
      nombre: 'Fresas'
    },
    {
      id: 'M',
      nombre: 'Manzanas'
    }
  ]

  formData: FormGroup;
  formData2: FormGroup;

  constructor(
    private dialog: MatDialog,
    private calendarService: CalendarioService,
    private cdr: ChangeDetectorRef,
    // private conoService: ConoMonetarioService,
    private fb: FormBuilder) {

  }


  get form() {
    return !this.formData ? {} : this.formData.controls;
  }

  get form2() {
    return !this.formData2 ? {} : this.formData2.controls;
  }

  ngOnInit() {

    this.calendarService.today().subscribe(data => {
      // console.log('today ',data.today);
      this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
    });

    this.formData = this.fb.group({
      fecha: new FormControl('', Validators.required),
      monto: new FormControl(undefined, Validators.required),
      telefono: new FormControl('', Validators.required),
      telefonoAlt: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required])
    })


    this.formData2 = this.fb.group({
      mostrar: [false],
      fruta: [''],
      cuenta: new FormControl('', Validators.required),
      fecha: new FormControl('', Validators.required),
      monto: new FormControl(undefined, Validators.required),
      telefono: new FormControl('', Validators.required)
    })


  }


  save() {
    if (this.formData.invalid) {
      return;
    }
    console.log('send form data to server');

  }

  save2() {
    if (this.formData2.invalid) {
      return;
    }
    console.log('send form data 2 to server');

  }

  addElement() {

    this.showFormPopup(DireccionFormPopupComponent, {}, '40%')
  }

  // detailCash() {

  //   this.showFormPopup(CashFormPopupComponent, { desgloseConoActual: this.conoActual, desgloseConoAnterior: this.conoActual, moneda: this.moneda }, '40%')
  // }

  addPerson(event){
    console.log('create ',event);
    
  }

  updatePerson(event){
    console.log('update ',event);
    
  }

  updateCashDetail(event) {
    console.log('update cash detail ',event)
    if(!event){
      return;
    }
    this.conoActual=event.desgloseConoActual;
    this.conoAnterior=event.desgloseConoAnterior;
    this.cdr.detectChanges();
  }

  private showFormPopup(popupComponent, data: any, withDialog = '60%'): MatDialogRef<any> {
    let data_aux = { payload: undefined, isNew: undefined };

    data_aux.payload = data;

    var dialogRef = this.dialog.open(popupComponent, {
      panelClass: 'dialog-frame',
      width: withDialog,
      disableClose: true,
      data: data_aux
    });

    return dialogRef;
  }

}
