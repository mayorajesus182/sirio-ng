import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
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
  primerRegistro: boolean=false;
  mostrarToggle: boolean=true;
  
  public tipoTelefonoList = new BehaviorSubject<TipoTelefono[]>([]);
  public telefonicaList = new BehaviorSubject<TipoTelefono[]>([]);
  public claseTelefonoList = new BehaviorSubject<ClaseTelefono[]>([]);

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


    // this.loadingDataForm.next(true);
    // if (this.defaults.payload.data) {
    //   this.telefonoService.get(this.defaults.payload.data.id).subscribe(data => {
    //     this.mode = 'global.edit';
    //     this.telefono = data;
    //     this.mostrarToggle = this.telefono.principal !== 1;
        this.buildForm();
    //     this.loadingDataForm.next(false);
    //   })
    // } else {
    //   this.mostrarToggle = !this.primerRegistro;
    //   this.telefono = {} as Telefono;
    //   this.buildForm();
    //   this.loadingDataForm.next(false);
    // }
  }

  buildForm() {
    this.itemForm = this.fb.group({
 
    });

  
  }


  save() {
    // this.updateData(this.telefono);// aca actualizamos la direccion
    // if (this.isNew) {
    //   this.telefono.persona = this.defaults.payload.persona;
    // }
    // this.telefono.numero = this.telefono.numero.split('-').join('');
    // this.telefono.principal = this.telefono.principal ? 1 : 0;
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    //this.saveOrUpdate(this.telefonoService, this.telefono, 'Teléfono', this.telefono.id == undefined);
    close()
  }

}