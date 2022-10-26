import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TipoIngresoConstants } from 'src/@sirio/constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Ramo, RamoService } from 'src/@sirio/domain/services/configuracion/persona-juridica/ramo.service';
import { ActividadIndependiente, ActividadIndependienteService } from 'src/@sirio/domain/services/configuracion/persona-natural/actividad-independiente.service';
import { TipoIngreso, TipoIngresoService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-ingreso.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { InformacionLaboral, InformacionLaboralService } from 'src/@sirio/domain/services/persona/informacion-laboral/informacion-laboral.service';
import { ReferenciaBancaria, ReferenciaBancariaService } from 'src/@sirio/domain/services/persona/referencia-bancaria/referencia-bancaria.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-referencia-bancaria-form.popup',
  templateUrl: './referencia-bancaria-form.popup.component.html',
  styleUrls: ['./referencia-bancaria-form.popup.component.scss']
})

export class ReferenciaBancariaFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  referencia: ReferenciaBancaria = {} as ReferenciaBancaria;

  public tipoingresoList = new BehaviorSubject<TipoIngreso[]>([]);
  public tipodocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public ramoList = new BehaviorSubject<Ramo[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public actinDependienteList = new BehaviorSubject<ActividadIndependiente[]>([]);
  public Tipo_Ingreso = TipoIngresoConstants;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ReferenciaBancariaFormPopupComponent>,
    private referenciaBancariaService: ReferenciaBancariaService,
    private tipoIngresoService: TipoIngresoService,
    private tipoDocumentoService: TipoDocumentoService,
    private actividadIndependienteService: ActividadIndependienteService,
    private ramoService: RamoService,


    private paisService: PaisService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.tipoIngresoService.actives().subscribe(data => {
      // console.log(data);

      this.tipoingresoList.next(data);

    })

    this.tipoDocumentoService.actives().subscribe(data => {
      // console.log(data);

      this.tipodocumentoList.next(data);

    })

    this.ramoService.actives().subscribe(data => {
      // console.log(data);

      this.ramoList.next(data);

    })

    this.actividadIndependienteService.actives().subscribe(data => {
      // console.log(data);

      this.actinDependienteList.next(data);

    })


    this.paisService.actives().subscribe(data => {
      // console.log(data);

      this.paisList.next(data);

    })

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.referenciaBancariaService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.referencia = data;
        this.buildForm();
        this.loadingDataForm.next(false);
        this.cdr.detectChanges();

      })
    } else {
      this.referencia = {} as ReferenciaBancaria;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  refreshValidators(val:string){
    if(!val){
      return;
    }

    if(val === TipoIngresoConstants.OTROS_INGRESOS){
      this.removeValidator(['tipoIngreso','remuneracion','actividadIndependiente']);
    }
    if(val === TipoIngresoConstants.NEGOCIO_PROPIO){
      this.removeValidator(['tipoIngreso','remuneracion','ramo','direccion']);
    }
    
    if(val === TipoIngresoConstants.RELACION_DEPENDENCIA){
      this.removeValidator(['tipoIngreso','remuneracion','ramo','cargo','empresa','direccion']);
    }

    this.cdr.detectChanges();
  }

  buildForm() {
    //validar carcteres especiales

    this.itemForm = this.fb.group({
      tipoIngreso: new FormControl(this.referencia.tipoIngreso || undefined, [Validators.required]),

      actividadIndependiente: new FormControl(this.referencia.actividadIndependiente || undefined),
      ramo: new FormControl(this.referencia.ramo || undefined),
      registro: new FormControl(this.referencia.registro || undefined),
      numero: new FormControl(this.referencia.numero || undefined),
      tomo: new FormControl(this.referencia.tomo || undefined),
      folio: new FormControl(this.referencia.folio || undefined),

      identificacion: new FormControl(this.referencia.identificacion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),

      fecha: new FormControl(this.referencia.fecha ? moment(this.referencia.fecha, 'DD/MM/YYYY') : ''),
      direccion: new FormControl(this.referencia.direccion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_SPACE)]),
      cargo: new FormControl(this.referencia.cargo || undefined, [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      remuneracion: new FormControl(this.referencia.remuneracion || undefined)
    });

    this.f.tipoIngreso.valueChanges.subscribe(val => {
      if (val) {
        this.refreshValidators(val);
      }
    });

    this.refreshValidators(this.informacionLaboral.tipoIngreso);

    this.cdr.detectChanges();
  }

  isRdOrNp() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    // verificar si es relacion de dependencia o negocio propopio
    return this.f.tipoIngreso.value == TipoIngresoConstants.RELACION_DEPENDENCIA || this.f.tipoIngreso.value == TipoIngresoConstants.NEGOCIO_PROPIO;
  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.informacionLaboral);// aca actualizamos Informacion Laboral
    this.informacionLaboral.persona = this.defaults.payload.persona;
    this.informacionLaboral.fecha = this.informacionLaboral.fecha ? this.informacionLaboral.fecha.format('DD/MM/YYYY') : '';
    console.log(this.informacionLaboral);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.referenciaBancariaService, this.informacionLaboral, 'Información Laboral', this.informacionLaboral.id == undefined);

  }

  private removeValidator(ignoreKeys: string[]) {
    Object.keys(this.f).forEach(key => {
      if (!ignoreKeys.includes(key)) {
        this.itemForm.get(key).setErrors(null);
        this.cdr.detectChanges();
      }
    });
  }
}