import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants';
import { Condicion, CondicionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/condicion.service';
import { Cargo, CargoService } from 'src/@sirio/domain/services/configuracion/persona-juridica/cargo.service';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-interviniente-form.popup',
  templateUrl: './interviniente-form.popup.component.html',
  styleUrls: ['./interviniente-form.popup.component.scss']
})

export class IntervinienteFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  todayValue: moment.Moment;

  interviniente: Interviniente = {} as Interviniente;
  persona: Persona = {} as Persona;

  tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);

  tipoParticipaciones = new BehaviorSubject<TipoParticipacion[]>([]);
  tipoFirmas = new BehaviorSubject<TipoFirma[]>([]);
  tipoFirmantes = new BehaviorSubject<TipoFirmante[]>([]);

  condiciones = new BehaviorSubject<Condicion[]>([]);
  cargos = new BehaviorSubject<Cargo[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<IntervinienteFormPopupComponent>,
    private intervinienteService: IntervinienteService,


    private tipoParticipacionService: TipoParticipacionService,
    private tipoFirmaService: TipoFirmaService,
    private tipoFirmanteService: TipoFirmanteService,

    private condicionService: CondicionService,
    private cargoService: CargoService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }



  ngAfterViewInit(): void {

  }

  ngOnInit() {

    // console.log(this.defaults);

    // if (!this.tipo_persona) {
    //   this.tipoDocumentoService.actives().subscribe(data => {
    //     this.tiposDocumentos.next(data);
    //   });
    // } else {
    //   this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
    //     this.tiposDocumentos.next(data);
    //   });
    // }

    this.tipoParticipacionService.actives().subscribe(data => {

      this.tipoParticipaciones.next(data);
      this.cdr.detectChanges();
    })

    this.condicionService.actives().subscribe(data => {

      this.condiciones.next(data);
      this.cdr.detectChanges();
    })
    
    this.cargoService.actives().subscribe(data => {

      this.cargos.next(data);
      this.cdr.detectChanges();
    })

    this.tipoFirmaService.actives().subscribe(data => {
      this.tipoFirmas.next(data);
      this.cdr.detectChanges();
    });

    this.tipoFirmanteService.actives().subscribe(data => {
      this.tipoFirmantes.next(data);
      this.cdr.detectChanges();
    });

    this.loadingDataForm.next(true);
    if (this.defaults.payload.cuenta && this.defaults.payload.persona) {
      this.intervinienteService.get(this.defaults.payload.cuenta, this.defaults.payload.persona).subscribe(data => {

        console.log(data);
        
        this.mode = 'global.edit';
        this.interviniente = data;
        this.persona.id = data.persona;
        this.persona.nombre = data.personaNombre;

        console.log(this.defaults.payload.identificacion);
        const val = this.defaults.payload.identificacion.split('-');
        console.log(val);
        
        this.persona.tipoDocumento = data.identificacion?val[0]:'';
        this.persona.identificacion = data.identificacion?val[1]: '';
        this.buildForm();

        this.loadingDataForm.next(false);

      })
    } else {
      this.interviniente = {} as Interviniente;
      // this.buildForm();
      this.loadingDataForm.next(false);
    }
  }



  pullPerson(event: any) {

    console.log('pul person ', event);
    this.mode = 'global.add';
    this.interviniente = {} as Interviniente;
    this.itemForm = undefined;
    if (!event.id && !event.numper) {
      this.interviniente = {} as Interviniente;
      const tpersona = event.tipoPersona == GlobalConstants.PERSONA_JURIDICA ? 'juridico' : 'natural';
      this.router.navigate([`/sirio/persona/${tpersona}/${event.tipoDocumento}/${event.identificacion}/add`]);
      this.dialogRef.close();
    } else {
      this.persona = event;
      this.interviniente.cuenta = this.defaults.payload.cuenta;
      this.interviniente.persona = event.id;
      this.buildForm();
      this.f.identificacion.setErrors(undefined);
      // console.log('intervinientes ',this.defaults.payload.intervinientes);
      // console.log('id ',this.persona.tipoDocumento+'-'+this.persona.identificacion);

      if (this.defaults.payload.intervinientes.includes(this.persona.tipoDocumento + '-' + this.persona.identificacion)) {
        // console.log('ya esta asociado');
        this.f.identificacion.setErrors({ exists: true });
        // this.f.identificacion.markAsTouched();
        this.cdr.detectChanges();
      }
    }

  }




  buildForm() {
    //validar carcteres especiales
    this.itemForm = this.fb.group({
      persona: new FormControl(this.interviniente.persona, [Validators.required]),
      identificacion: new FormControl(this.persona.identificacion, [Validators.required]),
      cuenta: new FormControl(this.interviniente.cuenta || undefined, [Validators.required]),
      tipoParticipacion: new FormControl(this.interviniente.tipoParticipacion || undefined, [Validators.required]),
      tipoFirma: new FormControl(this.interviniente.tipoFirma || undefined, [Validators.required]),
      tipoFirmante: new FormControl(this.interviniente.tipoFirmante || undefined, [Validators.required]),
      condicion: new FormControl(this.interviniente.condicion || undefined),
      cargo: new FormControl(this.interviniente.cargo || undefined),
    });

    this.cdr.detectChanges();
  }

  save() {
    // console.log('mode ', this.mode);
    this.updateData(this.interviniente);// aca actualizamos la direccion
    this.interviniente.cuenta = this.defaults.payload.cuenta;
    // console.log(this.interviniente);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdateWithoutClosed(this.intervinienteService,this,this.interviniente);

  }


}