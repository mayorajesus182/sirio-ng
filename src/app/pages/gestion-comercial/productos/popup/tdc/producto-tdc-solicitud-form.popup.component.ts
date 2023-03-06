import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { CuentaBanco } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-producto-tdc-solicitud-form.popup',
  templateUrl: './producto-tdc-solicitud-form.popup.component.html',
  styleUrls: ['./producto-tdc-solicitud-form.popup.component.scss']
})
export class ProductoTDCSolicitudFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {


  dataProducto: any = {};
  public telefonicas = new BehaviorSubject<Telefonica[]>([]);
  public cuentas = new BehaviorSubject<CuentaBanco[]>([]);
  path:string;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<ProductoTDCSolicitudFormPopupComponent>,
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
      this.dataProducto = this.defaults.payload;
      this.path = GlobalConstants.PATH_IMAGE_GCOMERCIAL+this.dataProducto.servicio.imageName;
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
      cuenta: new FormControl(undefined, [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
    });

  }

  send() {
    this.successResponse('La Información del Crédito', 'Enviada', false);
  }


}