import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants/global.constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Condicion, CondicionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/condicion.service';
import { TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoTelefono } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Apoderado, ApoderadoService } from 'src/@sirio/domain/services/persona/apoderado/apoderado.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-apoderado-form.popup',
  templateUrl: './apoderado-form.popup.component.html',
  styleUrls: ['./apoderado-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ApoderadoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  todayValue: moment.Moment;

  [x: string]: any;

  apoderado: Apoderado = {} as Apoderado;

  @Input() tipo_persona: string;

  private tiposDocumentos: TipoDocumento[] = [];
  public telefonicaList = new BehaviorSubject<TipoTelefono[]>([]);
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public condicionList = new BehaviorSubject<Condicion[]>([]);
  apoderados = [];
  paises = new BehaviorSubject<Pais[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ApoderadoFormPopupComponent>,
    private apoderadoService: ApoderadoService,
    private calendarioService: CalendarioService,
    private tipoDocumentoService: TipoDocumentoService,
    private condicionService: CondicionService,
    private paisService: PaisService,
    private telefonicaService: TelefonicaService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.loadingDataForm.next(false);

    this.apoderados = this.defaults.payload.apoderados;

    this.calendarioService.today().subscribe(data => {
      this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
    });


    this.tipoDocumentoService.activesNaturales().subscribe(data => {
      this.tiposDocumentos = data;
      this.tipoDocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.condicionService.actives().subscribe(data => {
      this.condicionList.next(data);
      this.cdr.detectChanges();
    })

    this.telefonicaService.actives().subscribe(data => {
      this.telefonicaList.next(data);
      this.cdr.detectChanges();
    })

    this.paisService.actives().subscribe(data => {
      this.paises.next(data);
    });

    if (this.defaults.payload.id) {
      this.loadingDataForm.next(true);
      this.apoderadoService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.apoderado = data;
        this.buildForm();
        this.loadingDataForm.next(false);

      })
    } else {
      this.apoderado = {} as Apoderado;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {
    //validar carcteres especiales
    this.itemForm = this.fb.group({
      tipoDocumento: new FormControl(this.apoderado.tipoDocumento || undefined, [Validators.required]),
      condicion: new FormControl(this.apoderado.condicion || undefined),
      identificacion: new FormControl(this.apoderado.identificacion || undefined, [Validators.required]),
      nombre: new FormControl(this.apoderado.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      fechaNacimiento: new FormControl(this.apoderado.fechaNacimiento ? moment(this.apoderado.fechaNacimiento, 'DD/MM/YYYY') : '', [Validators.required]),
      pais: new FormControl(this.apoderado.pais || undefined, [Validators.required]),
      registro: new FormControl(this.apoderado.registro || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      numero: new FormControl(this.apoderado.numero || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      telefono: new FormControl(this.apoderado.telefono || '', [Validators.required]),
      tomo: new FormControl(this.apoderado.tomo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      folio: new FormControl(this.apoderado.folio || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      fecha: new FormControl(this.apoderado.fecha ? moment(this.apoderado.fecha, 'DD/MM/YYYY') : ''),
      esApoderado: new FormControl(this.apoderado.esApoderado === 1 ? true : false),
    });

    this.f.identificacion.valueChanges.subscribe(val => {

      if (val) {
        if (!this.validateApoderados(this.f.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists: true });
          // this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }
      }
    });

    this.cdr.detectChanges();
  }


  validateApoderados(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }
    this.cdr.detectChanges();
    return this.apoderados.find(num => num === tipoDocumento + '-' + identificacion) == undefined;
  }

  save() {

    this.updateData(this.apoderado);// aca actualizamos la direccion
    this.apoderado.persona = this.defaults.payload.persona;
    this.apoderado.fecha = this.apoderado.fecha ? this.apoderado.fecha.format('DD/MM/YYYY') : '';
    this.apoderado.fechaNacimiento = this.apoderado.fechaNacimiento ? this.apoderado.fechaNacimiento.format('DD/MM/YYYY') : '';

    this.apoderado.esApoderado = this.apoderado.esApoderado ? 1 : 0;

    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.apoderadoService, this.apoderado, 'APODERADO', this.apoderado.id == undefined);

  }

  isLegalPerson() {

    let isLegal = this.tiposDocumentos.filter(t => t.id == this.f.tipoDocumento.value).map(t => t.tipoPersona).includes(PersonaConstants.PERSONA_JURIDICA);
    if (this.f.tipoDocumento.value && isLegal) {

      return true;
    } else {

      return false;

    }

    return false;
  }

}
