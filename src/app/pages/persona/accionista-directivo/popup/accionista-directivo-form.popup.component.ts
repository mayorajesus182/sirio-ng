import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { PepConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Cargo, CargoService } from 'src/@sirio/domain/services/configuracion/persona-juridica/cargo.service';
import { TipoPep, TipoPepService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-pep.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { AccionistaDirectivo, AccionistaDirectivoService } from 'src/@sirio/domain/services/persona/accionista-directivo/accionista-directivo.service';
import { PepAccionista } from 'src/@sirio/domain/services/persona/pep-accionista/pep.service';
import { Pep } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-accionista-directivo-form.popup',
  templateUrl: './accionista-directivo-form.popup.component.html',
  styleUrls: ['./accionista-directivo-form.popup.component.scss']
})

export class AccionistaDirectivoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  esPep: boolean=false;

  pep: Pep = {} as Pep;

  accionistaDirectivo: AccionistaDirectivo = {} as AccionistaDirectivo;
  pepAccionista: PepAccionista = {} as PepAccionista;

  public pepConstants = PepConstants;

  porcentajeAccionario:number=0;

  public pepAccionistaForm: FormGroup;

  public tipoPepList = new BehaviorSubject<TipoPep[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);

  public tipoDocumentoNatList = new BehaviorSubject<TipoDocumento[]>([]);

  pepList: PepAccionista[] = [];
  pepAccionistas: ReplaySubject<PepAccionista[]> = new ReplaySubject<PepAccionista[]>();
  accionistas = [];
  public cargoList = new BehaviorSubject<Cargo[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<AccionistaDirectivoFormPopupComponent>,
    private accionistaDirectivoService: AccionistaDirectivoService,
    private tipoDocumentoService: TipoDocumentoService,
    private paisService: PaisService,
    private tipoPepService: TipoPepService,
    private cargoService: CargoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

    this.f.esPep.valueChanges.subscribe(val=>{
      this.cdr.detectChanges()
    })

  }

  ngOnInit() {
    console.log(this.defaults)
    this.porcentajeAccionario = this.defaults.payload.porcentajeAccionario;
    this.accionistas = this.defaults.payload.accionistas;

    this.tipoPepService.activesForJuridico().subscribe(data => {

      this.tipoPepList.next(data);
      this.cdr.detectChanges();
    })

    this.tipoDocumentoService.actives().subscribe(data => {

      this.tipoDocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.tipoDocumentoService.activesNaturales().subscribe(data => {

      this.tipoDocumentoNatList.next(data);
      this.cdr.detectChanges();
    })

    this.paisService.actives().subscribe(data => {

      this.paisList.next(data);
      this.cdr.detectChanges();
    })

    this.cargoService.activesForAccionistas().subscribe(data => {

      this.cargoList.next(data);
      this.cdr.detectChanges();
    })


    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.accionistaDirectivoService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.accionistaDirectivo = data;
        this.buildForm();
        this.loadingDataForm.next(false);
      })
    } else {
      this.accionistaDirectivo = {} as AccionistaDirectivo;
      this.buildForm();
      this.loadingDataForm.next(false);
    }

    

    this.buildPepForm();
  }


  buildForm() {
    this.itemForm = this.fb.group({

      tipoDocumento: new FormControl(this.accionistaDirectivo.tipoDocumento || undefined, [Validators.required]),
      identificacion: new FormControl(this.accionistaDirectivo.identificacion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
      nombre: new FormControl(this.accionistaDirectivo.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      cargo: new FormControl(this.accionistaDirectivo.cargo || undefined, [Validators.required]),
      porcentaje: new FormControl(this.accionistaDirectivo.porcentaje || 0, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
      esPep: new FormControl(false),

    });

    this.pepAccionistas.subscribe(varpep =>{

      this.f.esPep.setValue(varpep?varpep.length>0:false)
      this.cdr.detectChanges();      
    })

    this.pepAccionistas.next(this.accionistaDirectivo.pepList);
    this.pepList = this.accionistaDirectivo.pepList || [];

    this.f.identificacion.valueChanges.subscribe(val => {

      if (val) {
        if (!this.validateAccionistas(this.f.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists: true });
          this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }
      }
    });
    

    this.cdr.detectChanges();
  }

  buildPepForm() {
    this.pepAccionistaForm = this.fb.group({
      tipoPep: new FormControl(this.pepAccionista.tipoPep || undefined, [Validators.required]),
      identificacion: new FormControl(this.pepAccionista.identificacion || undefined),
      tipoDocumento: new FormControl(this.pepAccionista.tipoDocumento || undefined),
      nombre: new FormControl(this.pepAccionista.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      ente: new FormControl(this.pepAccionista.ente || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      cargo: new FormControl(this.pepAccionista.cargo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      pais: new FormControl(this.pepAccionista.pais || undefined, [Validators.required]),

    });


    this.cf.tipoDocumento.valueChanges.subscribe(val => {
      if (val) {
        if (!this.validateIdentificacionPep(val, this.cf.identificacion ? this.cf.identificacion.value : undefined)) {
          this.cf.identificacion.setErrors({ exists: true })
        } else {
          this.cf.identificacion.setErrors(null)
        }
      }
    });

    this.cf.identificacion.valueChanges.subscribe(val => {
      if (val) {
        if (!this.validateIdentificacionPep(this.cf.tipoDocumento ? this.cf.tipoDocumento.value : undefined, val)) {
          this.cf.identificacion.setErrors({ exists: true })
        } else {
          this.cf.identificacion.setErrors(null)
        }
      }
    });

    this.cf.tipoPep.valueChanges.subscribe(val => {
      if (val) {
        if (val==this.pepConstants.CLIENTE) {
          this.cf.identificacion.setValue('')
          this.cf.tipoDocumento.setValue(undefined)
          this.cf.identificacion.setErrors(undefined)
          this.cf.tipoDocumento.setErrors(undefined)
          
          this.cf.nombre.setValue(this.f.nombre.value)

          this.esPep = true
        }  else {
          this.cf.nombre.setValue('')
          this.esPep = false
        }
        this.cdr.detectChanges();
      }
    });
  }

  get cf() {
    return this.pepAccionistaForm ? this.pepAccionistaForm.controls : {};
  }

  add() {
    let pep = {} as PepAccionista;

    if (this.pepAccionistaForm.value.tipoPep == "C"){

      if(this.pepAccionistaForm.value.tipoDocumento == undefined ){

        this.pepAccionistaForm.value.tipoDocumento = this.f.tipoDocumento.value
       }
      if(this.pepAccionistaForm.value.identificacion == "" ){

        this.pepAccionistaForm.value.identificacion = this.f.identificacion.value
      }
    }

    this.updateDataItemForm(pep, this.pepAccionistaForm);
    this.pepList.push(pep);`DX`
    this.pepAccionistas.next(this.pepList.slice());
    this.pepAccionistaForm.reset({});
    this.cdr.detectChanges();
  }

  validateAccionistas(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }
    this.cdr.detectChanges();
    return this.accionistas.find(num => num === tipoDocumento + '-' + identificacion) == undefined;
  }


  validateIdentificacionPep(tipoDocumento: string, identificacion: string) {
    if (!tipoDocumento || !identificacion) {
      return true;
    }
    return this.pepList.find(c => (c.tipoDocumento === tipoDocumento) && (c.identificacion === identificacion)) == undefined;
  }

  delete(row) {
    this.pepList.forEach((e, index) => {
      if (e.tipoDocumento.concat(e.identificacion) === row.tipoDocumento.concat(row.identificacion)) {
        this.pepList.splice(index, 1);
        this.pepAccionistas.next(this.pepList.slice());
      }
      this.cdr.detectChanges();
    });
  }

  //angel
  isRdOrNp() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    // verificar si es Asociado o Parentesco
    return this.f.tipoIngreso.value == PepConstants.ASOCIADO || this.f.tipoIngreso.value == PepConstants.PARENTESCO;
  }

  //verificar si es cliente

  isOtrIng() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    
    return this.f.tipoIngreso.value == PepConstants.CLIENTE;
  }

  save() {
    if(this.itemForm.invalid){
      return;
    }
    console.log(this.accionistaDirectivo)
    this.updateData(this.accionistaDirectivo);
    this.accionistaDirectivo.persona = this.defaults.payload.persona;

    // this.updateData(this.pepAccionista);// aca actualizamos la direccion
    // this.accionistaDirectivo.persona = this.defaults.payload.persona;

    this.accionistaDirectivo.pepList = this.pepList;


    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.accionistaDirectivoService, this.accionistaDirectivo, 'ACCIONISTADIRECTIVO', this.accionistaDirectivo.id == undefined);

  }

  // private removeValidator(ignoreKeys: string[]) {
  //   Object.keys(this.f).forEach(key => {
  //     if (!ignoreKeys.includes(key)) {
  //       this.itemForm.get(key).setErrors(null);
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }
}
