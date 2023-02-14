import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegularExpConstants, TarjetaDebitoConstants } from 'src/@sirio/constants';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';
import { BehaviorSubject } from 'rxjs';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
@Component({
  selector: 'sirio-informacion-tarjeta-form.popup',
  templateUrl: './informacion-tarjeta-form.popup.component.html',
  styleUrls: ['./informacion-tarjeta-form.popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InformacionTarjetaFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {
  telefono: Telefono = {} as Telefono;
  selectedStatus: string = 'bloqueo';
  // option: string = 'REP';
  option: boolean = false;
  persona: string;
  constante = TarjetaDebitoConstants;
  public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<InformacionTarjetaFormPopupComponent>,
    private telefonoService: TelefonoService,
    private cuentaBancariaService: CuentaBancariaService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.option = this.defaults.payload.option;
    this.persona = this.defaults.payload.persona;
    console.log("holaaaaa", this.defaults.payload.persona);
    this.cdr.detectChanges();

    this.loadingDataForm.next(true);
    if (this.defaults.payload.persona) {
      this.cuentaBancariaService.activesByNumper(this.defaults.payload.persona.numper).subscribe(data => {
        this.cuentasBancarias.next(data);
        if (data.length === 1) {
            this.f.numeroCuenta.setValue(data[0].id);
        }
    });
    //   this.f.numeroCuenta.valueChanges.subscribe(val => {
    //     if (val && (val != '')) {
    //         this.cuentasBancarias.value.filter(e => e.id == val)[0];
    //     }
    // });
      // this.telefonoService.get(this.defaults.payload.data.id).subscribe(data => {
        // this.mode = 'global.edit';
        // this.telefono = data;
        this.buildForm();
        this.loadingDataForm.next(false);
      // })
    } else {
      // this.telefono = {} as Telefono;
      this.buildForm();
      this.loadingDataForm.next(false);
    }


  }

  buildForm() {
    this.itemForm = this.fb.group({
      tipoTarjeta: new FormControl(''),
      nombreEstampacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
      numeroTarjeta: new FormControl(''),
      numeroCuenta: new FormControl(''),
      motivo: new FormControl('', [Validators.required]),
      observacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_CHARACTERS_SPACE)]),
      email: new FormControl('', [Validators.required]),
    });
  //   this.f.numeroCuenta.valueChanges.subscribe(val => {
  //     if (val && (val != '')) {
  //         this.cuentasBancarias.value.filter(e => e.id == val)[0];
  //     }
  // });
    this.cdr.detectChanges();
  }


  // No borrar este Código de Prueba

  changeStatus(event) {
    console.log("event", event);
    
    // if (event.checked) {
    //   this.selectedStatus = false;
    // }
  }

  // esBloqueo(event) {
  //   if (event.checked) {
  //     this.selectedStatus = this.f.bloqueo.value;
  //   }
  // }


  save() {
    this.updateData(this.telefono);// aca actualizamos la direccion
    if (this.isNew) {
      this.telefono.persona = this.defaults.payload.persona;
    }
    this.telefono.numero = this.telefono.numero.split('-').join('');
    this.telefono.principal = this.telefono.principal ? 1 : 0;
    this.saveOrUpdate(this.telefonoService, this.telefono, 'Teléfono', this.telefono.id == undefined);

  }
}