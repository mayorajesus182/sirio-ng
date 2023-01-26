
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { EntidadFinanciera, EntidadFinancieraService } from 'src/@sirio/domain/services/configuracion/entidad-financiera.service';
import { CifraPromedio, CifraPromedioService } from 'src/@sirio/domain/services/configuracion/producto/cifra-promedio.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { ReferenciaBancaria, ReferenciaBancariaService } from 'src/@sirio/domain/services/persona/referencia-bancaria/referencia-bancaria.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-referencia-bancaria-form.popup',
  templateUrl: './referencia-bancaria-form.popup.component.html',
  styleUrls: ['./referencia-bancaria-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReferenciaBancariaFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  referencia: ReferenciaBancaria = {} as ReferenciaBancaria;
  public tipoProductoList = new BehaviorSubject<TipoProducto[]>([]);
  public cifrasPromedioList = new BehaviorSubject<CifraPromedio[]>([]);
  public entidadFinancieraList = new BehaviorSubject<EntidadFinanciera[]>([]);
  referencias = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ReferenciaBancariaFormPopupComponent>,
    private referenciaBancariaService: ReferenciaBancariaService,
    private tipoProductoService: TipoProductoService,
    private cifraPromedioService: CifraPromedioService,
    private entidadFinancieraService: EntidadFinancieraService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

    this.loading$.subscribe(loading => {
      if (this.f.entidadFinanciera.value) {
        this.entidadFinancieraService.actives().subscribe(data => {
          this.entidadFinancieraList.next(data);
          this.cdr.detectChanges();
        });
      }
    });

  }

  ngOnInit() {
    this.tipoProductoService.actives().subscribe(data => {
      this.tipoProductoList.next(data);
    });

    this.cifraPromedioService.actives().subscribe(data => {
      this.cifrasPromedioList.next(data);
    });

    this.entidadFinancieraService.actives().subscribe(data => {
      this.entidadFinancieraList.next(data);
    });

    this.referencias = this.defaults.payload.referencias
    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.referenciaBancariaService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.referencia = data;
        this.buildForm();
        this.loadingDataForm.next(false);
        this.cdr.detectChanges();

      })
    } else {
      this.referencia = {} as ReferenciaBancaria;
      this.buildForm();
      this.loadingDataForm.next(false);
      this.cdr.detectChanges();
    }
  }


  buildForm() {
    this.itemForm = this.fb.group({
      tipoProducto: new FormControl(this.referencia.tipoProducto || '', [Validators.required]),
      entidadFinanciera: new FormControl(this.referencia.entidadFinanciera || '', [Validators.required]),
      cifraPromedio: new FormControl(this.referencia.cifraPromedio || '', [Validators.required]),
      numeroCuenta: new FormControl(this.referencia.numeroCuenta || undefined, [Validators.required]),

    });

    this.f.entidadFinanciera.valueChanges.subscribe((val: string) => {

      this.f.numeroCuenta.setValue('');
      if (this.f.numeroCuenta.errors) {
        return;
      }

      if (val && this.f.numeroCuenta.value && !this.f.numeroCuenta.value.startsWith(val)) {
        this.f.numeroCuenta.setErrors({ notIsEntidad: true });
      }
    });

    this.f.numeroCuenta.valueChanges.subscribe(val => {
      if (this.f.numeroCuenta.errors) {
        return;
      }
      if (val) {
        if (this.f.entidadFinanciera.value && !val.startsWith(this.f.entidadFinanciera.value)) {
          this.f.numeroCuenta.setErrors({ notIsEntidad: true });
          this.f.numeroCuenta.markAsDirty();
          return;
        }
        if (!this.validateNumeroCuenta(this.f.numeroCuenta ? this.f.numeroCuenta.value : undefined)) {
          this.f.numeroCuenta.setErrors({ exists: true })
          this.f.numeroCuenta.markAsDirty();
        }
        this.cdr.detectChanges();
      }
    });


    this.f.tipoProducto.valueChanges.subscribe(value => {

      this.f.numeroCuenta.setValue('');
      this.f.entidadFinanciera.setValue(undefined);
      this.cdr.detectChanges();

      if (value) {
        this.entidadFinancieraService.actives().subscribe(data => {
          this.entidadFinancieraList.next(data);
          this.cdr.detectChanges();
        });
      }
    });
    this.cdr.detectChanges();

  }

  validateNumeroCuenta(numeroCuenta: string) {
    if (!numeroCuenta) {
      return true;
    }

    return this.referencias.find(c => (c.numeroCuenta === numeroCuenta)) == undefined;
  }

  save() {
    this.updateData(this.referencia);// aca actualizamos Informacion Laboral
    this.referencia.persona = this.defaults.payload.persona;
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.referenciaBancariaService, this.referencia, 'Referencia Bancaria', this.referencia.id == undefined);

  }

}