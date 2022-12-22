import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { GlobalConstants, RegularExpConstants } from "src/@sirio/constants";
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

  get search(): AbstractControl | any {
    return this.searchForm ? this.searchForm.controls : {};
}


  public queryByPerson() {

    if (this.search.identificacion.errors) {
        return;
    }

    const tipoDocumento = this.search.tipoDocumento.value;
    const identificacion = this.search.identificacion.value;

    this.loading.next(true);

    if (tipoDocumento && identificacion) {

        this.personaService.getByTipoDocAndIdentificacion(tipoDocumento, identificacion).subscribe(data => {
            this.persona = data;
            this.search.nombre.setValue(data.nombre);
            this.loading.next(false);
            // this.isNew = false;
            if (this.result) {
                this.persona.identificacion = identificacion;
                this.result.emit(this.persona);
            }


            this.search.identificacion.setErrors(null);
            this.search.cuenta.setValue('');
            this.disable.next(true);
            this.cdref.detectChanges();

        }, err => {

            this.persona = {} as Persona;
            // this.isNew = true;
            this.loading.next(false);
            if (this.result) {
                this.result.emit(this.persona);
            }
            this.search.identificacion.setErrors({ notexists: true });
            this.search.nombre.setValue(' ');
            this.search.cuenta.setValue('');

            this.cdref.detectChanges();
        })
    } else if (!tipoDocumento) {

        // this.search.tipoDocumento.setErrors({required:true});
        this.searchForm.controls['identificacion'].setErrors({ requiredTipoDoc: true });
        this.searchForm.controls['identificacion'].markAsDirty();
        this.cdref.detectChanges();
    }
  }


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
    this.saveOrUpdate(this.intervinienteService,this.interviniente,'INTERVINIENTE',this.interviniente.id==undefined);

  }

  // nombreCliente(){

  //     if(!this.f.municipio.value || this.f.municipio.value.length==0 || !this.municipios.value){
  //       return '';
  //     }
  //     return this.municipios.value.filter(m=>m.id===this.f.municipio.value)[0]?.ciudad || '';
  //   }

  // }

  // isNaturalPerson() {
  //   if (this.search.tipoDocumento.value && !this.legals.includes(this.search.tipoDocumento.value)) {
  //       return true;
  //   } else if (this.tipo_persona) {

  //       return this.tipo_persona == GlobalConstants.PERSONA_NATURAL;
  //   }


  // }


}