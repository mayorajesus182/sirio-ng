import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { PepConstants, RegularExpConstants, TipoPepConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { TipoPep, TipoPepService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-pep.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Pep, PepService } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-pep-form.popup',
  templateUrl: './pep-form.popup.component.html',
  styleUrls: ['./pep-form.popup.component.scss']
})

export class PepFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  pep: Pep = {} as Pep;
  public tipoPepList = new BehaviorSubject<TipoPep[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public Pep = PepConstants;
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  peps = [];
  tipoDocumento = undefined;
  pepsTi = undefined;
  persona: Persona = undefined;
  tipDoc = undefined;
  esPep: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<PepFormPopupComponent>,
    private pepService: PepService,
    private tipoPepService: TipoPepService,
    private paisService: PaisService,
    private tipoDocumentoService: TipoDocumentoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.peps = this.defaults.payload.peps;
    this.pepsTi  = this.defaults.payload.nombre;
    this.tipDoc  = this.defaults.payload.tipoDocumento
    this.persona = (typeof this.defaults.payload.persona == "number") ? { id: this.defaults.payload.persona } : this.defaults.payload.persona;

    console.log('Payload ',this.defaults.payload);
    
    this.tipoDocumento =  this.defaults.payload.persona?.tipoDocumento;
    // console.log(this.peps)

    this.tipoPepService.activesForNatural().subscribe(data => {

      // remuevo el elemento seleccionado
      this.tipoPepList.next(data.filter(d => !this.peps.map(p => p.tipo).includes(d.nombre) || this.defaults.payload.id != undefined || this.peps.length == 0));
      this.cdr.detectChanges();
    })

    this.tipoDocumentoService.activesNaturales().subscribe(data => {
      this.tipoDocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.paisService.actives().subscribe(data => {
      this.paisList.next(data);
      this.cdr.detectChanges();
    })

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.pepService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.pep = data;
        this.buildForm();
        this.loadingDataForm.next(false);

      })
    } else {
      this.pep = {} as Pep;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }


  buildForm() {
    this.itemForm = this.fb.group({
      tipoPep: new FormControl(this.pep.tipoPep || undefined, [Validators.required]),
      tipoDocumento: new FormControl(this.pep.tipoDocumento || undefined),
      identificacion: new FormControl(this.pep.identificacion || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
      nombre: new FormControl(this.pep.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      ente: new FormControl(this.pep.ente || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      cargo: new FormControl(this.pep.cargo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      pais: new FormControl(this.pep.pais || undefined, [Validators.required])
    });
    this.cdr.detectChanges();

    if (this.pep.tipoPep = 'C') {
      this.f.nombre.disable();
    }



    this.f.identificacion.valueChanges.subscribe(val => {

      if (val) {
        if (!this.validatePeps(this.f.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists: true });
          this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }
      }
    });

    this.f.tipoPep.valueChanges.subscribe(val => {
      if (val && val === TipoPepConstants.CLIENTE_ES_PEP) {
        this.f.identificacion.setValue(this.persona.identificacion);
        this.f.nombre.setValue(this.pepsTi);
        // this.esPep = true;
        this.f.nombre.disable();
      }else {

        this.f.identificacion.setValue('');
        this.f.nombre.setValue('');
        this.f.nombre.enable();

      }
    })

  }


  validatePeps(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }

    this.cdr.detectChanges();

    return this.peps.map(p => p.identificacion).find(doc => doc === tipoDocumento + '-' + identificacion) == undefined;
  }

  isRdOrNp() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    return this.f.tipoIngreso.value == PepConstants.ASOCIADO || this.f.tipoIngreso.value == PepConstants.PARENTESCO;
  }

  isOtrIng() {
    if (!this.f.tipoIngreso.value) {
      return;
    }
    return this.f.tipoIngreso.value == PepConstants.CLIENTE;
  }


  save() {
    this.f.nombre.enable();
    this.updateData(this.pep);// aca actualizamos la direccion

    if(this.pep.persona == null ) {
    this.pep.persona = this.defaults.payload.persona.id;
    }
    if(this.pep.tipoPep == "C" ) {
      this.pep.tipoDocumento = this.tipDoc;
    }
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.pepService, this.pep, 'PEP', this.pep.id == undefined);
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
