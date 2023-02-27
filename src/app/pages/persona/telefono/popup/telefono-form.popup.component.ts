import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants, TelefonoConstants } from 'src/@sirio/constants';
import { ClaseTelefono, ClaseTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/clase-telefono.service';
import { TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoTelefono, TipoTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-telefono-form.popup',
  templateUrl: './telefono-form.popup.component.html',
  styleUrls: ['./telefono-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TelefonoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  telefono: Telefono = {} as Telefono;
  esPrincipal: boolean = false;
  mostrarToggle: boolean = true;
  public tipoTelefonoList = new BehaviorSubject<TipoTelefono[]>([]);
  public telefonicaList = new BehaviorSubject<TipoTelefono[]>([]);
  public claseTelefonoList = new BehaviorSubject<ClaseTelefono[]>([]);
  cantidadActual = 0;
  nroTelefonos = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<TelefonoFormPopupComponent>,
    private telefonoService: TelefonoService,
    private telefonicaService: TelefonicaService,
    private tipoTelefonoService: TipoTelefonoService,
    private claseTelefonoService: ClaseTelefonoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.esPrincipal = this.defaults.payload.principal;
    this.nroTelefonos = this.defaults.payload.telefonos;
    this.cantidadActual = this.nroTelefonos? this.nroTelefonos.length:0;
    // this.primerRegistro = this.defaults.payload.primero;

    this.tipoTelefonoService.actives().subscribe(data => {
      this.tipoTelefonoList.next(data);
      this.cdr.detectChanges();
    })

    this.claseTelefonoService.actives().subscribe(data => {

      this.claseTelefonoList.next(data);
      this.cdr.detectChanges();
    })


    this.cdr.detectChanges();

    this.loadingDataForm.next(true);
    if (this.defaults.payload.data) {
      this.telefonoService.get(this.defaults.payload.data.id).subscribe(data => {
        this.mode = 'global.edit';
        this.telefono = data;
        this.mostrarToggle = this.telefono.principal !== 1;
        this.buildForm();
        this.loadingDataForm.next(false);
      })
    } else {
      this.mostrarToggle = this.cantidadActual!=0;
      this.telefono = {} as Telefono;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {
    this.itemForm = this.fb.group({
      tipoTelefono: new FormControl({value:this.telefono.tipoTelefono || ( this.cantidadActual == 0 ? TelefonoConstants.TIPO_TELEFONO_PERSONAL : undefined), disabled:this.cantidadActual == 0}, [Validators.required]),
      claseTelefono: new FormControl({value:this.telefono.claseTelefono || ( this.cantidadActual == 0 ? TelefonoConstants.TELEFONO_CELULAR : ''), disabled:this.cantidadActual == 0}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      numero: new FormControl(this.telefono.numero || '', [Validators.required]),
      principal: new FormControl(this.telefono.principal == 1 ? true : this.cantidadActual==0)
    });




    this.f.claseTelefono.valueChanges.subscribe(val => {
      if (val) {
        this.f.numero.setValue('');
        this.telefonicaService.activesByClaseTelefono(val).subscribe(data => {
          this.telefonicaList.next(data);
        })
      }
    })

    this.f.numero.valueChanges.subscribe(val => {
      if (val) {
        if (!this.validateNumeroTelefono(this.f.numero ? this.f.numero.value : undefined)) {
          this.f.numero.setErrors({ exists: true });
          // this.f.numero.markAsTouched();
          this.cdr.detectChanges();
        }
      }
    });

    if(this.cantidadActual==0){
      this.telefonicaService.activesByClaseTelefono(TelefonoConstants.TELEFONO_CELULAR).subscribe(data => {
        this.telefonicaList.next(data);
      })
    }

    this.cdr.detectChanges();
  }

  validateNumeroTelefono(numero: string) {
    if (!numero) {
      return true;
    }
    this.cdr.detectChanges();
    return this.nroTelefonos.find(num => num === numero) == undefined;
  }

  save() {
    this.updateData(this.telefono);// aca actualizamos la direccion
    if (this.isNew) {
      this.telefono.persona = this.defaults.payload.persona;
    }
    this.telefono.numero = this.telefono.numero.split('-').join('');
    this.telefono.principal = this.telefono.principal ? 1 : 0;
    if(this.cantidadActual==0){
      this.telefono.claseTelefono=this.f.claseTelefono.value;
      this.telefono.tipoTelefono=this.f.tipoTelefono.value;
    }

    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.telefonoService, this.telefono, 'Teléfono', this.telefono.id == undefined);

  }

  evaluarEsPrincipal(): boolean {
    if (this.esPrincipal && (this.isNew || this.f.principal.value)) {
      return false;
    }
    return true;
  }
}