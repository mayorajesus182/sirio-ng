import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Cargo, CargoService } from 'src/@sirio/domain/services/configuracion/persona-natural/cargo.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { AccionistaDirectivo, AccionistaDirectivoService } from 'src/@sirio/domain/services/persona/accionista-directivo/accionista-directivo.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-accionista-directivo-form.popup',
  templateUrl: './accionista-directivo-form.popup.component.html',
  styleUrls: ['./accionista-directivo-form.popup.component.scss']
})

export class AccionistaDirectivoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  accionistaDirectivo: AccionistaDirectivo = {} as AccionistaDirectivo;
  
  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);

  public cargoList = new BehaviorSubject<Cargo[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<AccionistaDirectivoFormPopupComponent>,
    private accionistaDirectivoService: AccionistaDirectivoService,

    private tipoDocumentoService: TipoDocumentoService,

    private cargoService: CargoService,
 
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {


    this.tipoDocumentoService.actives().subscribe(data => {
      console.log(data);
      
      this.tipoDocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.cargoService.actives().subscribe(data => {
      console.log(data);
      
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

  save() {

    // console.log('mode ', this.mode);
    this.updateData(this.accionistaDirectivo);// aca actualizamos la direccion
    this.accionistaDirectivo.persona = this.defaults.payload.persona;
   
   
    console.log(this.accionistaDirectivo);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.accionistaDirectivoService,this.accionistaDirectivo,'ACCIONISTADIRECTIVO',this.accionistaDirectivo.id==undefined);

  }
}