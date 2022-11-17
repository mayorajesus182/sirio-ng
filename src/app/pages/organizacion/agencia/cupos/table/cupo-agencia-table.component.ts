import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';




@Component({
  selector: 'app-cupo-agencia-table',
  templateUrl: './cupo-agencia-table.component.html',
  styleUrls: ['./cupo-agencia-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CupoAgenciaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public cupoData: CupoAgencia[];
  public cupos: ReplaySubject<CupoAgencia[]> = new ReplaySubject<CupoAgencia[]>();
  public keywords: string = '';
  agenciaId: string;
  agencia: string;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;


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
    });
  }

  ngOnInit() {

    this.agenciaId = this.route.snapshot.params['id'];

    const data = history.state.data;

    if (data) {
      this.agencia = data.nombre;
      sessionStorage.setItem('agn_nombre', data.nombre);
    } else {
      this.agencia = sessionStorage.getItem('agn_nombre')
    }

    if (this.agenciaId) {
      this.loadList();
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  onFilterChange(value) {

    value = value.trim();
    value = value.toLowerCase();

    this.cupos.next(
      this.cupoData.filter(item => {
        if (
          item.moneda &&
          item.moneda
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 || !value
        ) {

          return true;
        }
      }).slice());
  }


  update() {

    this.btnState = true;
    this.cupoAgenciaService.update(this.cupoData).subscribe(data => {
      this.btnState = false;
      this.successResponse('El Registro se', 'Actualizó')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });

  }


}

