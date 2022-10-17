import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  public empleadoData: EmpleadoTransporte[];
  transportistaId: string;
  transportista: string;
  datosPersona: string;



  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private empleadoTransporteService: EmpleadoTransporteService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.empleadoTransporteService.allByTransportista(this.transportistaId).subscribe((data) => {
      this.empleadoData = data;
      this.empleados.next(data.slice());
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];

    const data = history.state.data;// obteniendo data del state

    if (data) {
      // en caso que venga data la guardo en el session storage
      // sessionStorage.setItem('id',data.codigo);
      this.transportista = data.nombre;
      sessionStorage.setItem('trans_nombre', data.nombre);
    } else {
      this.transportista = sessionStorage.getItem('trans_nombre')
    }

    if (this.transportistaId) {
      this.loadList();
    }
  }

  ngAfterViewInit() {
    // this.afterInit();
  }

  ngOnDestroy() {

  }

  onFilterChange(value) {

    value = value.trim();
    value = value.toLowerCase();

    this.empleados.next(
      this.empleadoData.filter(item => {
        if (
          item.id &&
          item.id
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 ||
          item.nombre &&
          item.nombre
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 ||
          item.identificacion &&
          item.identificacion
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 || !value
        ) {

          return true;
        }
      }).slice());
  }

  openPopup(data: any) {

    if (data) {
      data.transportista = this.transportistaId;
    }

    this.showFormPopup(EmpleadoTransportePopupComponent, data || { transportista: this.transportistaId }, '50%');

    this.dialogRef.afterClosed().subscribe(event => {
      this.loadList()
    });
  }


  activateOrInactivate(row: EmpleadoTransporte) {
    if (!row || !row.id) {
      return;
    }

    this.applyChangeStatus(this.empleadoTransporteService, row, row.nombre, this.cdr);
  }

}

