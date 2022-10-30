import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoTelefono, TipoTelefonoService } from 'src/@sirio/domain/services/configuracion/telefono/tipo-telefono.service';
import { Telefono, TelefonoService } from 'src/@sirio/domain/services/persona/telefono/telefono.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-telefono-form.popup',
  templateUrl: './telefono-form.popup.component.html',
  styleUrls: ['./telefono-form.popup.component.scss']
})

export class TelefonoFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  telefono: Telefono = {} as Telefono;
  
  public tipoTelefonoList = new BehaviorSubject<TipoTelefono[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<TelefonoFormPopupComponent>,
    private telefonoService: TelefonoService,

    private tipoTelefonoService: TipoTelefonoService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {


    this.tipoTelefonoService.actives().subscribe(data => {
      console.log(data);
      
      this.tipoTelefonoList.next(data);
      this.cdr.detectChanges();
    })
    
    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.telefonoService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.telefono = data;
        this.buildForm();
        this.loadingDataForm.next(false);
       
      })
    } else {
      this.telefono = {} as Telefono;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {
//validar carcteres especiales
    this.itemForm = this.fb.group({
      
      tipoTelefono: new FormControl(this.telefono.tipoTelefono || undefined, [Validators.required]),
      
      claseTelefono: new FormControl(this.telefono.claseTelefono || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      
      prefijo: new FormControl(this.telefono.prefijo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
     
      numero: new FormControl(this.telefono.numero || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),

      principal: new FormControl(this.telefono.principal || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
    
    
    });


    this.cdr.detectChanges();
  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.telefono);// aca actualizamos la direccion
    this.telefono.persona=this.defaults.payload.persona;
    console.log(this.telefono);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.telefonoService,this.telefono,'TELEFONO',this.telefono.id==undefined);

  }
}