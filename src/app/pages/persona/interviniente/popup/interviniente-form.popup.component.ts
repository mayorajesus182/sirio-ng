import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
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


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<IntervinienteFormPopupComponent>,
    private intervinienteService: IntervinienteService,

    private tipoDocumentoService: TipoDocumentoService,


    private tipoParticipacionService: TipoParticipacionService,
    private tipoFirmaService: TipoFirmaService,
    private tipoFirmanteService: TipoFirmanteService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

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
      console.log(data);

      this.tipoParticipaciones.next(data);
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
    if (this.defaults.payload.id) {
      this.intervinienteService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.interviniente = data;
        this.buildForm();

        // console.log('mode ', this.mode);

        this.loadingDataForm.next(false);

      })
    } else {
      this.interviniente = {} as Interviniente;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }


  addPerson(event) {

    console.log('create ', event);
    this.mode = 'global.add';
    this.interviniente = {} as Interviniente;
    // this.updateDataFromValues(this.cuentaBanco, event);
    this.buildForm();
    // this.loaded$.next(true);
    // if(this.itemForm){
    //     this.f.tipoDocumento.setValue(this.cuentaBanco.tipoDocumento);
    //     this.f.identificacion.setValue(this.cuentaBanco.identificacion);
    // }
    //TODO: ESTO ES POSIBLE QUE SE USE
    // this.router.navigate([`/sirio/persona/natural/${event.tipoDocumento}/${event.documento}/add`]);
  }

  pullPerson(event: any) {

    console.log('pul person ', event);
    this.mode = 'global.add';
    this.interviniente = {} as Interviniente;

    if (!event.id && !event.numper) {
      this.interviniente = {} as Interviniente;
      //TODO: DEBO REDIRECCIONAR A LA CREACIÓN DEL INTERVINIENTE
      // this.resetAll();
      // this.router.navigate([`/sirio/persona/natural/${event.tipoDocumento}/${event.documento}/add`]);
    } else {
      this.persona = event;
      this.interviniente.cuenta = this.defaults.payload.cuenta;
      this.interviniente.persona = event.id;
      // this.updateDataFromValues(this.cuentaBanco, event);
      this.buildForm();
    }
    
  }




  buildForm() {
    //validar carcteres especiales
    this.itemForm = this.fb.group({
      persona: new FormControl(this.interviniente.persona, [Validators.required]),
      cuenta: new FormControl(this.interviniente.cuenta || undefined, [Validators.required]),
      tipoParticipacion: new FormControl(this.interviniente.tipoParticipacion || undefined, [Validators.required]),
      tipoFirma: new FormControl(this.interviniente.tipoFirma || undefined, [Validators.required]),
      tipoFirmante: new FormControl(this.interviniente.tipoFirmante || undefined, [Validators.required]),
    });

    this.cdr.detectChanges();
  }

  save() {
    // console.log('mode ', this.mode);
    this.updateData(this.interviniente);// aca actualizamos la direccion
    this.interviniente.cuenta = this.defaults.payload.cuenta;
    console.log(this.interviniente);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.intervinienteService, this.interviniente, 'INTERVINIENTE');

  }


}