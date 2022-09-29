import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-direccion-form.popup',
  templateUrl: './direccion-form.popup.component.html',
  styleUrls: ['./direccion-form.popup.component.scss']
})
export class DireccionFormPopupComponent extends PopupBaseComponent implements OnInit {

  static id = 100;

  direccion: any;

  form: FormGroup;
  

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
     dialogRef: MatDialogRef<DireccionFormPopupComponent>,
    private fb: FormBuilder) {

    super(dialogRef,injector)
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

    this.form = this.fb.group({
      id: [DireccionFormPopupComponent.id++],
      firstName: [this.direccion.firstName || '',],
      lastName: [this.direccion.lastName || ''],
      street: this.direccion.street || '',
      city: this.direccion.city || '',
      zipcode: this.direccion.zipcode || '',
      phoneNumber: this.direccion.phoneNumber || '',
    });
  }

  save() {
    console.log('mode ',this.mode);
    
  }


}
