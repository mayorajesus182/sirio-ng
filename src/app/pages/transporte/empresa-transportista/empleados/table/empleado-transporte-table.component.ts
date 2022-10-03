import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { EmpleadoTransportePopupComponent } from '../popup/empleado-transporte-popup.component';




@Component({
  selector: 'app-empleado-transporte-table',
  templateUrl: './empleado-transporte-table.component.html',
  styleUrls: ['./empleado-transporte-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class EmpleadoTransporteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public empleados: ReplaySubject<EmpleadoTransporte[]> = new ReplaySubject<EmpleadoTransporte[]>();
  private dialogoPopup: MatDialogRef<EmpleadoTransportePopupComponent>;
  transportista: string;
  datosPersona: string;


  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private empleadoTransporteService: EmpleadoTransporteService,
    private cdr: ChangeDetectorRef) {
    super(undefined, injector);
  }


  loadList() {
    this.empleadoTransporteService.allByTransportista(this.transportista).subscribe((data) => {
      this.empleados.next(data.slice());
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {

    this.transportista = this.route.snapshot.params['id'];

    if (this.transportista) {
      this.loadList();
    }
  }

  ngAfterViewInit() {
    // this.afterInit();
  }

  ngOnDestroy() {

  }

  openPopup(id) {
    this.dialogoPopup = this.dialog.open(EmpleadoTransportePopupComponent, {
      panelClass: 'form-dialog',
      width: '70%',
      disableClose: true,
      data: { payload: { persona: this.transportista, id: id }, isNew: true }
    });

    this.dialogoPopup.afterClosed().subscribe(res => {
      if (res)
        this.loadList();
    });
  }


  activateOrInactivate(row: EmpleadoTransporte) {
    if (!row || !row.id) {
      return;
    }

    this.applyChangeStatus(this.empleadoTransporteService, row, row.nombre, this.cdr);
  }

}

