import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-capture-image-form.popup',
  templateUrl: './capture-image-form.popup.component.html',
  styleUrls: ['./capture-image-form.popup.component.scss']
})
export class CaptureImageFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  public valuesCono1: ConoMonetario[] = [];
  public valuesCono2: ConoMonetario[] = [];
  public moneda: Moneda = {} as Moneda;
  public operation: string;
  public preferencia = new BehaviorSubject<Preferencia>(undefined);
  // private divisor:number=1;

  public montoTotal = 0;
  public totalActual = 0;
  public totalAnterior = 0;
  public total = 0;
  private divisor = 1;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    private preferenciaService: PreferenciaService,
    dialogRef: MatDialogRef<CaptureImageFormPopupComponent>,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

    this.cdref.markForCheck();

  }

  ngOnInit() {


    if (this.defaults.id) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

    this.cdref.markForCheck();


  }

  save() {
    console.log('mode ', this.mode);

    this.dialogRef.close(
      {
        desgloseConoActual: this.valuesCono1,
        desgloseConoAnterior: this.valuesCono2,
        montoTotal: this.montoTotal
      });

  }
  

  close() {

    this.dialogRef.close(
      {
        desgloseConoActual: [],
        desgloseConoAnterior: [],
        montoTotal: 0
      });

  }



  clearAll() {
    // this.cdref.detectChanges();
  }

  notValidate(){
    
    return this.valuesCono1.map(c=>c.errors).filter(e=>e!=null || e != undefined).length > 0 || this.valuesCono2.map(c=>c.errors).filter(e=>e!=null).length > 0;
  }

}
