
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { ReferenciaPersonal, ReferenciaPersonalService } from 'src/@sirio/domain/services/persona/referencia-personal/referencia-personal.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-referencia-personal-form.popup',
  templateUrl: './referencia-personal-form.popup.component.html',
  styleUrls: ['./referencia-personal-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReferenciaPersonalFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {
  personaDoc = undefined;
  referencia: ReferenciaPersonal = {} as ReferenciaPersonal;
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public telefonicaMovilList = new BehaviorSubject<Telefonica[]>([]);
  public telefonicaFijaList = new BehaviorSubject<Telefonica[]>([]);
  referencias = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ReferenciaPersonalFormPopupComponent>,
    private referenciaPersonalService: ReferenciaPersonalService,
    private telefonicaService: TelefonicaService,
    private tipoDocumentoService: TipoDocumentoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.tipoDocumentoService.activesNaturales().subscribe(data => {
      this.tipoDocumentoList.next(data);
    });

    this.telefonicaService.activesByTipoTelefonica(PersonaConstants.TELEFONO_FIJO).subscribe(data => {
      this.telefonicaFijaList.next(data);
    })

    this.telefonicaService.activesByTipoTelefonica(PersonaConstants.TELEFONO_MOVIL).subscribe(data => {
      this.telefonicaMovilList.next(data);
    })

    this.referencias = this.defaults.payload.referencias;

    this.personaDoc =this.defaults.payload.personaDoc
    this.cdr.detectChanges();
    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {

      this.referenciaPersonalService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.referencia = data;
        this.buildForm();
        this.loadingDataForm.next(false);
        this.cdr.detectChanges();
      })
    } else {
      this.referencia = {} as ReferenciaPersonal;
      this.buildForm();
      this.loadingDataForm.next(false);
      this.cdr.detectChanges();
    }
  }

  buildForm() {
    this.itemForm = this.fb.group({
      tipoDocumento: new FormControl(this.referencia.tipoDocumento || PersonaConstants.PN_TIPO_DOC_DEFAULT, [Validators.required]),
      identificacion: new FormControl(this.referencia.identificacion || '', [Validators.required]),
      nombre: new FormControl(this.referencia.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      telefonoFijo: new FormControl(this.referencia.telefonoFijo || undefined, []),
      telefonoMovil: new FormControl(this.referencia.telefonoMovil || undefined, []),
    });

    this.f.tipoDocumento.valueChanges.subscribe(value => {
      this.f.identificacion.setValue('');
      this.cdr.detectChanges();
    });

    this.f.identificacion.valueChanges.subscribe(val => {
      if (val) {
        if (!this.validateReferencias(this.f.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists: true });
          this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }

          if (!this.validatetitular(this.f.identificacion ? this.f.identificacion.value : undefined)) {
            this.f.identificacion.setErrors({ exists2: true });
            this.f.identificacion.markAsDirty();
            this.cdr.detectChanges();
          }


      }

    });
  }

  validateReferencias(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }
    this.cdr.detectChanges();

    console.log(tipoDocumento);

    console.log(identificacion);

    console.log(this.referencias);

    return this.referencias.find(num => num === tipoDocumento + '-' + identificacion) == undefined;
  }




  validatetitular(identificacion: string) {
    if (!identificacion) {
      return true;
    }
    this.cdr.detectChanges();

    console.log(identificacion);

    if (this.personaDoc === identificacion){
      return false
    }
    return true
  }


  save() {
    console.log(this.referencia)
    this.updateData(this.referencia);// aca actualizamos Informacion Laboral
    this.referencia.persona = this.defaults.payload.persona;
    this.referencia.telefonoFijo = this.referencia.telefonoFijo ? this.referencia.telefonoFijo.split(' ').join('') : undefined;
    this.referencia.telefonoMovil = this.referencia.telefonoMovil ? this.referencia.telefonoMovil.split(' ').join('') : undefined;
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.referenciaPersonalService, this.referencia, 'Referencia Personal', this.referencia.id == undefined);

  }

}
