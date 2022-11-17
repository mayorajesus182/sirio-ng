import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-taquilla-chart.popup',
  templateUrl: './taquilla-chart.popup.component.html',
  styleUrls: ['./taquilla-chart.popup.component.scss']
})
export class TaquillaChartPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {


  // public nombreVia = new BehaviorSubject<NombreVia[]>([]);
  // public nombreNucleo = new BehaviorSubject<NombreNucleo[]>([]);
  // public estadonombreCostruccion = new BehaviorSubject<EstadonombreCostruccion[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<TaquillaChartPopupComponent>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }
  ngAfterViewInit(): void {
    // esto se utiliza en modo edición

    this.loading$.subscribe(loading => {
      if (!loading) {


      }
    });
  }

  ngOnInit() {

   
  }


  save() {

  }


}