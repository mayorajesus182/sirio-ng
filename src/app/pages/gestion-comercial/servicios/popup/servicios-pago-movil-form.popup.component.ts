import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-servicios-pago_movil-form.popup',
  templateUrl: './servicios-pago-movil-form.popup.component.html',
  styleUrls: ['./servicios-pago-movil-form.popup.component.scss']
})
export class ServiciosPagoMovilFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {


  dataServicio: any = {};
  public telefonicas = new BehaviorSubject<Telefonica[]>([]);
  public cuentas = new BehaviorSubject<CuentaBanco[]>([]);
  path:string;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ServiciosPagoMovilFormPopupComponent>,
    private cuentaBancoService: CuentaBancoService,
    private telefonicaService: TelefonicaService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.loadingDataForm.next(true);
    if (this.defaults.payload) {
      this.dataServicio = this.defaults.payload;
      this.path = GlobalConstants.PATH_IMAGE_GCOMERCIAL+this.dataServicio.servicio.imageName;
      this.mode = 'global.edit';
      this.buildForm();
    }

    this.telefonicaService.activesByTipoTelefonica(PersonaConstants.TELEFONO_MOVIL).subscribe(data => {
      this.telefonicas.next(data);
      this.cdr.detectChanges();
    });
  }

  buildForm() {

    this.itemForm = this.fb.group({
      telefono: new FormControl('', [Validators.required]),
    });

  }

  save() {

    this.successResponse('La Información del Crédito', 'Enviada', false);
  }


}