import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
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
export class CashFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  static id = 100;
  public valuesCono1=new BehaviorSubject<ConoMonetario[]>([]);
  public valuesCono2=new BehaviorSubject<ConoMonetario[]>([]);
  public moneda:string='BOLIVARES';

  public totalActual=0;
  public totalAnterior=0;
  public total=100;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<CashFormPopupComponent>,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    ) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {    

    // this.valuesCono1.subscribe(data=>{
    //   console.log(' change values cono 1', data);      
    // })

    // this.valuesCono2.subscribe(data=>{
    //   console.log(' change values cono 2', data);      
    // })
    this.cdref.markForCheck();

  }

  ngOnInit() {

    console.log(this.defaults.payload.desgloseConoActual);
    console.log(this.defaults.payload.desgloseConoAnterior);

    this.valuesCono1.next(this.defaults.payload.desgloseConoActual)
    this.valuesCono2.next(this.defaults.payload.desgloseConoAnterior)

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

  updateConoActual(list:ConoMonetario[]){
    console.log('update cono actual ', list);

    this.valuesCono1.next(list.slice());
    // calculo de totales para el cono actual
    this.totalActual= 0;
    this.totalActual=list.map(e=>e.count*e.denominacion).reduce((a,b)=>a+b);
    this.cdref.detectChanges();
    
  }
  
  updateConoAnterior(list:ConoMonetario[]){
    console.log('update cono anterior ', list);
    
    this.valuesCono2.next(list.slice());
    // calculo de totale para el cono anterior
    this.totalAnterior= 0;
    this.totalAnterior=list.map(e=>e.count*e.denominacion/1000000).reduce((a,b)=>a+b);
    this.cdref.detectChanges();

  }
 


}
