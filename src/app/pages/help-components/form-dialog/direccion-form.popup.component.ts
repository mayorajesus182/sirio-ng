import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-direccion-form.popup',
  templateUrl: './direccion-form.popup.component.html',
  styleUrls: ['./direccion-form.popup.component.scss']
})
export class DireccionFormPopupComponent extends PopupBaseComponent implements OnInit {

  static id = 100;
  conoActual: Observable<ConoMonetario>[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<DireccionFormPopupComponent>,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngOnInit() {

    console.log(this.defaults);

    if (this.defaults.id) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

    this.conoActual.push(this.defaults.conoActual);

    this.itemForm = this.fb.group({
      firstName: new FormControl(this.defaults.firstName || '', [Validators.required]),
      lastName: [this.defaults.lastName || ''],
      street: [this.defaults.street || ''],
      city: [this.defaults.city || ''],
      zipcode: [this.defaults.zipcode || ''],
      phoneNumber: [this.defaults.phoneNumber || ''],
    });
  }

  save() {
    console.log('mode ', this.mode);

    // this.saveOrUpdate()


    this.dialogRef.close();

  }


}
