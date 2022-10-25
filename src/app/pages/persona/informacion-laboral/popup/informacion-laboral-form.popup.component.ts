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
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-informacion-laboral-form.popup',
  templateUrl: './informacion-laboral-form.popup.component.html',
  styleUrls: ['./informacion-laboral-form.popup.component.scss']
})

export class InformacionLaboralFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  informacionLaboral: InformacionLaboral = {} as InformacionLaboral;

  public tipoingresoList = new BehaviorSubject<TipoIngreso[]>([]);
  public tipodocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public ramoList = new BehaviorSubject<Ramo[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public actinDependienteList = new BehaviorSubject<ActividadIndependiente[]>([]);
  public Tipo_Ingreso = TipoIngresoConstants;


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<InformacionLaboralFormPopupComponent>,
    private informacionLaboralService: InformacionLaboralService,
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
  }

  buildForm() {
    //validar carcteres especiales
    this.itemForm = this.fb.group({
      tipoIngreso: new FormControl(this.informacionLaboral.tipoIngreso || undefined, [Validators.required]),
      
      actividadIndependiente: new FormControl(this.informacionLaboral.actividadIndependiente || undefined, []),
      ramo: new FormControl(this.informacionLaboral.ramo || undefined, []),
      
      registro: new FormControl(this.informacionLaboral.registro || undefined, []),
      tomo: new FormControl(this.informacionLaboral.tomo || undefined, []),
      folio: new FormControl(this.informacionLaboral.folio || undefined, []),


      identificacion: new FormControl(this.informacionLaboral.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
      empresa: new FormControl(this.informacionLaboral.empresa || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      fecha: new FormControl(this.informacionLaboral.fecha ? moment(this.informacionLaboral.fecha, 'DD/MM/YYYY') : '', []),
      direccion: new FormControl(this.informacionLaboral.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      cargo: new FormControl(this.informacionLaboral.direccion || '', [Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      remuneracion: new FormControl(this.informacionLaboral.remuneracion || undefined, [])
    });

    this.f.tipoIngreso.valueChanges.subscribe(val=>{
      if(val){
        // this.itemForm.clearValidators();
        // this.itemForm.updateValueAndValidity();
        // this.cdr.detectChanges();
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
    })

    this.cdr.detectChanges();
  }

  isRdOrNp() {
    if(!this.f.tipoIngreso.value){
      return;
    }
    // verificar si es relacion de dependencia o negocio propopio
    return this.f.tipoIngreso.value==TipoIngresoConstants.RELACION_DEPENDENCIA || this.f.tipoIngreso.value==TipoIngresoConstants.NEGOCIO_PROPIO;
  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.informacionLaboral);// aca actualizamos Informacion Laboral
    this.informacionLaboral.persona = this.defaults.payload.persona;
    this.informacionLaboral.fecha = this.informacionLaboral.fecha? this.informacionLaboral.fecha.format('DD/MM/YYYY'): '';
    console.log(this.informacionLaboral);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.informacionLaboralService, this.informacionLaboral, 'Información Laboral', this.informacionLaboral.id == undefined);

  }

  private removeValidator(ignoreKeys:string[]){
    Object.keys(this.f).forEach(key => {
      if(!ignoreKeys.includes(key)){
        this.itemForm.get(key).setErrors(null) ;
        this.cdr.detectChanges();
      }
  });
  }
}