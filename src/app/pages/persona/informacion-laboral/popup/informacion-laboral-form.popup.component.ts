import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { BehaviorSubject, forkJoin } from 'rxjs';
import { GlobalConstants, TipoIngresoConstants } from 'src/@sirio/constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Ramo, RamoService } from 'src/@sirio/domain/services/configuracion/persona-juridica/ramo.service';
import { ActividadIndependiente, ActividadIndependienteService } from 'src/@sirio/domain/services/configuracion/persona-natural/actividad-independiente.service';
import { Profesion, ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { TipoIngreso, TipoIngresoService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-ingreso.service';
import { TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoTelefono } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { InformacionLaboral, InformacionLaboralService } from 'src/@sirio/domain/services/persona/informacion-laboral/informacion-laboral.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-informacion-laboral-form.popup',
  templateUrl: './informacion-laboral-form.popup.component.html',
  styleUrls: ['./informacion-laboral-form.popup.component.scss']
})

export class InformacionLaboralFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  todayValue: moment.Moment;
  informacionLaboral: InformacionLaboral = {} as InformacionLaboral;

  public tipoingresoList = new BehaviorSubject<TipoIngreso[]>([]);
  public tipodocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public ramoList = new BehaviorSubject<Ramo[]>([]);
  public profesionList = new BehaviorSubject<Profesion[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public telefonicaList = new BehaviorSubject<TipoTelefono[]>([]);
  public actinDependienteList = new BehaviorSubject<ActividadIndependiente[]>([]);
  public Tipo_Ingreso = TipoIngresoConstants;
  informacionLaborales = [];


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<InformacionLaboralFormPopupComponent>,
    private informacionLaboralService: InformacionLaboralService,
    private tipoIngresoService: TipoIngresoService,
    private tipoDocumentoService: TipoDocumentoService,
    private telefonicaService: TelefonicaService,
    private actividadIndependienteService: ActividadIndependienteService,
    private ramoService: RamoService,
    private profesionService: ProfesionService,
    private calendarioService: CalendarioService,

    private paisService: PaisService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.informacionLaborales = this.defaults.payload.informacionLaborales;

    console.log("informacionLaborales",this.informacionLaborales);

    this.loaded.next(false);
    forkJoin([
      this.tipoIngresoService.actives(),
      this.calendarioService.today(),
      this.tipoDocumentoService.activesJuridicos(),
      this.telefonicaService.actives(),
      this.ramoService.actives(),
      this.actividadIndependienteService.actives(),
      this.paisService.actives(),
      this.profesionService.actives()
    ]).subscribe(
      (data: any) => {
        // aqu?? se tiene toda la info de todas las peticiones
        
        // this.tipoingresoList.next(data[0]);
        this.tipoingresoList.next(data[0].filter((d: any )=>!this.informacionLaborales.map(p=>p.tipo).includes(d.id) || this.defaults.payload.id!=undefined || this.informacionLaborales.length ==0 ));
        this.todayValue = moment(data[1], GlobalConstants.DATE_SHORT);
        this.tipodocumentoList.next(data[2]);
        this.telefonicaList.next(data[3]);
        this.ramoList.next(data[4]);
        this.actinDependienteList.next(data[5]);
        this.paisList.next(data[6]);
        this.profesionList.next(data[7]);

        this.loaded.next(true);

        this.loadingDataForm.next(true);
        if (this.defaults.payload.id) {
          this.informacionLaboralService.get(this.defaults.payload.id).subscribe(data => {
            this.mode = 'global.edit';
            this.informacionLaboral = data;
            this.buildForm();
            this.loadingDataForm.next(false);
            this.cdr.detectChanges();

          })
        } else {
          this.informacionLaboral = {} as InformacionLaboral;
          this.buildForm();
          this.loadingDataForm.next(false);
        }
        // this.loadingDataForm.next(false);
      });


  }

  refreshValidators(val: string) {
    if (!val) {
      return;
    }

    if (val === TipoIngresoConstants.OTROS_INGRESOS) {
      this.removeValidator(['tipoIngreso', 'remuneracion', 'actividadIndependiente']);
    }
    if (val === TipoIngresoConstants.NEGOCIO_PROPIO) {
      this.removeValidator(['tipoIngreso', 'remuneracion', 'ramo', 'direccion', 'telefono', 'registro', 'numero', 'tomo', 'folio', 'fecha', 'empresa', 'identificacion']);
    }

    if (val === TipoIngresoConstants.RELACION_DEPENDENCIA) {
      this.removeValidator(['tipoIngreso', 'remuneracion', 'ramo', 'profesion', 'empresa', 'direccion', 'identificacion', 'fecha', 'telefono']);
    }

    this.cdr.detectChanges();
  }

  buildForm() {
    this.itemForm = this.fb.group({
      tipoIngreso: new FormControl(this.informacionLaboral.tipoIngreso || undefined, [Validators.required]),
      actividadIndependiente: new FormControl(this.informacionLaboral.actividadIndependiente || undefined),
      ramo: new FormControl(this.informacionLaboral.ramo || undefined),
      registro: new FormControl(this.informacionLaboral.registro || undefined),
      numero: new FormControl(this.informacionLaboral.numero || undefined),
      tomo: new FormControl(this.informacionLaboral.tomo || undefined),
      folio: new FormControl(this.informacionLaboral.folio || undefined),
      telefono: new FormControl(this.informacionLaboral.telefono || undefined),
      tipoDocumento: new FormControl(this.informacionLaboral.tipoDocumento || undefined, [Validators.required]),
      identificacion: new FormControl(this.informacionLaboral.identificacion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
      // empresa: new FormControl(this.informacionLaboral.empresa || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
      empresa: new FormControl(this.informacionLaboral.empresa || '', [Validators.required]),
      fecha: new FormControl(this.informacionLaboral.fecha ? moment(this.informacionLaboral.fecha, 'DD/MM/YYYY') : '', [Validators.required]),
      // direccion: new FormControl(this.informacionLaboral.direccion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_SPACE)]),
      // direccion: new FormControl(this.informacionLaboral.direccion || '', [Validators.required]),

      direccion: new FormControl(this.informacionLaboral.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),



      profesion: new FormControl(this.informacionLaboral.profesion || undefined),
      remuneracion: new FormControl(this.informacionLaboral.remuneracion || undefined, [Validators.required]),
    });

    this.f.tipoIngreso.valueChanges.subscribe(val => {
      if (val) {
        this.refreshValidators(val);
        this.cdr.detectChanges();
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
    return (this.f.tipoIngreso.value == TipoIngresoConstants.RELACION_DEPENDENCIA) || (this.f.tipoIngreso.value == TipoIngresoConstants.NEGOCIO_PROPIO);
  }

  isOtrIng() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    // verificar si es otros ingresos
    return this.f.tipoIngreso.value == TipoIngresoConstants.OTROS_INGRESOS;
  }

  isRd() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    // verificar si es relacion de dependencia
    return this.f.tipoIngreso.value === TipoIngresoConstants.RELACION_DEPENDENCIA;

  }

  save() {

    // console.log("pruebas log informacionLaboral", this.informacionLaboral)

    this.updateData(this.informacionLaboral);// aca actualizamos Informacion Laboral
    this.informacionLaboral.profesion = this.informacionLaboral.profesion;

    this.informacionLaboral.persona = this.defaults.payload.persona;
    this.informacionLaboral.fecha = this.informacionLaboral.fecha ? this.informacionLaboral.fecha.format('DD/MM/YYYY') : '';
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.informacionLaboralService, this.informacionLaboral, 'Informaci??n Laboral', this.informacionLaboral.id == undefined);
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
