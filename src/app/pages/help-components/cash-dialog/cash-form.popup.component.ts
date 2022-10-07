import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-cash-form.popup',
  templateUrl: './cash-form.popup.component.html',
  styleUrls: ['./cash-form.popup.component.scss']
})
export class CashFormPopupComponent extends PopupBaseComponent implements OnInit {

  static id = 100;
  public cono=new BehaviorSubject<ConoMonetario[]>([]);
  public cono2=new BehaviorSubject<ConoMonetario[]>([]);
  public moneda:string;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<CashFormPopupComponent>,
    private fb: FormBuilder,
    ) {

    super(dialogRef, injector)
  }

  ngOnInit() {

    console.log(this.defaults);

    this.cono.next(this.defaults.payload.conoActual)
    this.cono2.next(this.defaults.payload.conoAnterior)
    this.moneda= this.defaults.payload.moneda;

    if (this.defaults.id) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

   
  }

  save() {
    console.log('mode ', this.mode);

    // this.saveOrUpdate()


    this.dialogRef.close();

  }


}
