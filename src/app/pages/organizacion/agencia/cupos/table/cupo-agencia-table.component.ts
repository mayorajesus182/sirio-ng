import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { CupoAgenciaPopupComponent } from '../popup/cupo-agencia-popup.component';




@Component({
  selector: 'app-cupo-agencia-table',
  templateUrl: './cupo-agencia-table.component.html',
  styleUrls: ['./cupo-agencia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CupoAgenciaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public cupos: ReplaySubject<CupoAgencia[]> = new ReplaySubject<CupoAgencia[]>();
  public cupoData: CupoAgencia[];
  agenciaId: string;
  agencia: string;
  datosPersona: string;



  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private cupoAgenciaService: CupoAgenciaService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.cupoAgenciaService.activesByAgencia(this.agenciaId).subscribe((data) => {
      this.cupoData = data;
      this.cupos.next(data.slice());
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {

    this.agenciaId = this.route.snapshot.params['id'];

    const data = history.state.data;// obteniendo data del state

    if (data) {
      // en caso que venga data la guardo en el session storage
      // sessionStorage.setItem('id',data.codigo);
      this.agencia = data.nombre;
      sessionStorage.setItem('agencia_nombre', data.nombre);
    } else {
      this.agencia = sessionStorage.getItem('agencia_nombre')
    }

    if (this.agenciaId) {
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

    this.cupos.next(
      this.cupoData.filter(item => {
        if (
          item.moneda && item.moneda.toString().toLowerCase().indexOf(value) !== -1) {

          return true;
        }
      }).slice());
  }

  openPopup(data: any) {

    if (data) {
      data.agencia = this.agenciaId;
    }

    this.showFormPopup(CupoAgenciaPopupComponent, data || { agencia: this.agenciaId }, '50%');

    this.dialogRef.afterClosed().subscribe(event => {
      this.loadList()
    });
  }

  delete(element: CupoAgencia) {
    element.agencia = this.agenciaId;
    this.swalService.show('¿Desea Eliminar el Cupo?', '').then((resp) => {
      if (!resp.dismiss) {
        this.cupoAgenciaService.delete(element).subscribe(data => {
          this.successResponse('El Cupo', 'Eliminado', false);
          this.loadList();
          return data;
        }, error => this.errorResponse(true));
      }
    });
  }


}
