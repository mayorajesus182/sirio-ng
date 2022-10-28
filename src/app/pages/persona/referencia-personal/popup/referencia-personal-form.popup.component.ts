
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { EntidadFinanciera, EntidadFinancieraService } from 'src/@sirio/domain/services/configuracion/entidad-financiera.service';
import { CifraPromedio, CifraPromedioService } from 'src/@sirio/domain/services/configuracion/producto/cifras-promedio.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
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

  referencia: ReferenciaPersonal = {} as ReferenciaPersonal;

  public tipoDocumentoList = new BehaviorSubject<TipoDocumento[]>([]);
  public cifrasPromedioList = new BehaviorSubject<CifraPromedio[]>([]);
  public entidadFinancieraList = new BehaviorSubject<EntidadFinanciera[]>([]);



  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ReferenciaPersonalFormPopupComponent>,
    private referenciaPersonalService: ReferenciaPersonalService,

    private tipoDocumentoService: TipoDocumentoService,
    private cifraPromedioService: CifraPromedioService,
    private entidadFinancieraService: EntidadFinancieraService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.tipoDocumentoService.actives().subscribe(data => {

      this.tipoDocumentoList.next(data);

    });

    this.cifraPromedioService.actives().subscribe(data => {

      this.cifrasPromedioList.next(data);

    });

    this.entidadFinancieraService.actives().subscribe(data => {

      this.entidadFinancieraList.next(data);

    });

    console.log('ref personal',this.defaults.payload);
    

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
    //validar carcteres especiales

    this.itemForm = this.fb.group({
      tipoDocumento: new FormControl(this.referencia.tipoDocumento || '', [Validators.required]),
      identificacion: new FormControl(this.referencia.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
      nombre: new FormControl(this.referencia.nombre || '', [Validators.required,Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      telefonoFijo: new FormControl(this.referencia.telefonoFijo || undefined, []),
      telefonoMovil: new FormControl(this.referencia.telefonoMovil || undefined, []),
      // tipoProducto: new FormControl(this.referencia.tipoProducto || '', [Validators.required]),
      // entidadFinanciera: new FormControl(this.referencia.entidadFinanciera || '', [Validators.required]),
      // cifraPromedio: new FormControl(this.referencia.cifraPromedio || '', [Validators.required]),
      // numeroCuenta: new FormControl(this.referencia.numeroCuenta || undefined, [Validators.required]),

    });

   

  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.referencia);// aca actualizamos Informacion Laboral
    this.referencia.persona = this.defaults.payload.persona;
    this.referencia.telefonoFijo = this.referencia.telefonoFijo? this.referencia.telefonoFijo.split(' ').join(''): undefined;
    this.referencia.telefonoMovil = this.referencia.telefonoMovil? this.referencia.telefonoMovil.split(' ').join(''): undefined;
    console.log(this.referencia);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.referenciaPersonalService, this.referencia, 'Referencia Personal', this.referencia.id == undefined);

  }

}