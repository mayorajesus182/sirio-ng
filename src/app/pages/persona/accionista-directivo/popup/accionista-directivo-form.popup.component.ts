import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Cargo, CargoService } from 'src/@sirio/domain/services/configuracion/persona-natural/cargo.service';
import { TipoPep, TipoPepService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-pep.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { AccionistaDirectivo, AccionistaDirectivoService } from 'src/@sirio/domain/services/persona/accionista-directivo/accionista-directivo.service';
import { PepAccionista } from 'src/@sirio/domain/services/persona/pep-accionista/pep.service';
import { Pep } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { Cheque } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-accionista-directivo-form.popup',
  templateUrl: './accionista-directivo-form.popup.component.html',
  styleUrls: ['./accionista-directivo-form.popup.component.scss']
})

export class AccionistaDirectivoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  accionistaDirectivo: AccionistaDirectivo = {} as AccionistaDirectivo;
  pepAccionista: PepAccionista = {} as PepAccionista;

  public pepAccionistaForm: FormGroup;

  public tipoPepList = new BehaviorSubject<TipoPep[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);

  pepList: PepAccionista[] = [];
  pepAccionistas: ReplaySubject<PepAccionista[]> = new ReplaySubject<PepAccionista[]>();

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

  }

  ngOnInit() {

    this.tipoPepService.actives().subscribe(data => {

      this.tipoPepList.next(data);
      this.cdr.detectChanges();
    })



    this.tipoDocumentoService.actives().subscribe(data => {

      this.tipoDocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.paisService.actives().subscribe(data => {

      this.paisList.next(data);
      this.cdr.detectChanges();
    })

    this.cargoService.actives().subscribe(data => {

      this.cargoList.next(data);
      this.cdr.detectChanges();
    })


    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.accionistaDirectivoService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.accionistaDirectivo = data;
        this.buildForm();

        // console.log('mode ', this.mode);

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
      cargoId: new FormControl(this.accionistaDirectivo.cargoId || undefined, [Validators.required]),
      porcentaje: new FormControl(this.accionistaDirectivo.porcentaje || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),

    });


    this.cdr.detectChanges();
  }

  buildPepForm() {
    this.pepAccionistaForm = this.fb.group({
      // tipoPep: const newLocal = (new FormControl(this.pepAccionista.tipoPep || undefined, [Validators.required]),
      tipoPep: new FormControl(this.pepAccionista.tipoPep || '', [Validators.required]),
      tipoDocumento: new FormControl(this.pepAccionista.tipoDocumento || '', [Validators.required]),
      identificacion: new FormControl(this.pepAccionista.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
      nombre: new FormControl(this.pepAccionista.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      ente: new FormControl(this.pepAccionista.ente || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      cargo: new FormControl(this.pepAccionista.cargo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      pais: new FormControl(this.pepAccionista.pais || undefined, [Validators.required]),
      
    });

    
  }

  get cf() {
    return this.pepAccionistaForm ? this.pepAccionistaForm.controls : {};
  }




  add() {
    let pep = {} as PepAccionista;
    this.updateDataItemForm(pep, this.pepAccionistaForm);
    this.pepList.push(pep);
    this.pepAccionistas.next(this.pepList.slice());
    this.pepAccionistaForm.reset({});
    this.cdr.detectChanges();
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

  save() {

    // console.log('mode ', this.mode);
    this.updateData(this.accionistaDirectivo);// aca actualizamos la direccion
    this.accionistaDirectivo.persona = this.defaults.payload.persona;

    console.log('Save ', this.accionistaDirectivo);

    // {{printErrors() | json}} 

    // this.updateData(this.pepAccionista);// aca actualizamos la direccion
    // this.accionistaDirectivo.persona = this.defaults.payload.persona;

    this.accionistaDirectivo.pepList = this.pepList;


    console.log(this.accionistaDirectivo);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.accionistaDirectivoService, this.accionistaDirectivo, 'ACCIONISTADIRECTIVO', this.accionistaDirectivo.id == undefined);

  }
}