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
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-interviniente-form.popup',
  templateUrl: './interviniente-form.popup.component.html',
  styleUrls: ['./interviniente-form.popup.component.scss']
})

export class IntervinienteFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  todayValue: moment.Moment;
  // isNew: boolean = false;
  @Input() tipo_persona: string;

  [x: string]: any;

  interviniente: Interviniente = {} as Interviniente;

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

    if (!this.tipo_persona) {
      this.tipoDocumentoService.actives().subscribe(data => {
        this.tiposDocumentos.next(data);
      });
    } else {
      this.tipoDocumentoService.activesByTipoPersona(this.tipo_persona).subscribe(data => {
        this.tiposDocumentos.next(data);
      });

    }


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
    this.loaded$.next(true);
    // if(this.itemForm){
    //     this.f.tipoDocumento.setValue(this.cuentaBanco.tipoDocumento);
    //     this.f.identificacion.setValue(this.cuentaBanco.identificacion);
    // }
    //TODO: ESTO ES POSIBLE QUE SE USE
    // this.router.navigate([`/sirio/persona/natural/${event.tipoDocumento}/${event.documento}/add`]);
  }

  updatePerson(event) {
    console.log('update ', event);
    if (!event.id) {
      return;
    }

    this.mode = 'global.edit';
    this.persona = event;
    // this.loadingDataForm.next(true);
 
    this.interviniente = {} as Interviniente;
    //console.log('current loaded ', this.loaded$.value);
    this.buildForm();

    this.loaded$.next(true);
    // this.loadingDataForm.next(true);
    // this.cuentaBancoService.get(Number.parseInt(event.id)).subscribe(val => {
    //     this.cuentaBanco = val;
    //     //console.log('PERSONAAAA: ', val);
    //     //TODO: OJO REVISAR ESTO LUEGO
    //     // this.itemForm.reset({});
    //     this.loadingDataForm.next(false);
    //     this.loaded$.next(true);
    //     this.applyFieldsDirty();
    //     this.cdr.detectChanges();
    // });
    //TODO: ESTO ES POSIBLE QUE SE USE
    // this.router.navigate([`/sirio/persona/natural/${event.id}/edit`]);
  }

  // queryResult(event) {
  //   // console.log('event result ', event);

  //   if (!event.id && !event.numper) {
  //     this.loaded$.next(false);
  //     this.cuentaBanco = {} as CuentaBanco;
  //     this.isNew = true;
  //     this.cdr.detectChanges();
  //   }
  // }



  buildForm() {
    //validar carcteres especiales
    this.itemForm = this.fb.group({
      tipoParticipacion: new FormControl(this.interviniente.tipoParticipacion || undefined, [Validators.required]),

      tipoFirma: new FormControl(this.interviniente.tipoFirma || undefined, [Validators.required]),

      tipoFirmante: new FormControl(this.interviniente.tipoFirmante || undefined, [Validators.required]),
    });


    this.cdr.detectChanges();
  }

  save() {

    // console.log('mode ', this.mode);
    this.updateData(this.interviniente);// aca actualizamos la direccion
    this.interviniente.persona = this.defaults.payload.persona;
    console.log(this.interviniente);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.intervinienteService, this.interviniente, 'INTERVINIENTE', this.interviniente.id == undefined);

  }


}