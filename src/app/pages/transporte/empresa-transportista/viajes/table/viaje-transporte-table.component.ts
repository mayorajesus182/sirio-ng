import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ViajeTransporte, ViajeTransporteService } from 'src/@sirio/domain/services/transporte/viajes/viaje-transporte.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';




@Component({
  selector: 'app-viaje-transporte-table',
  templateUrl: './viaje-transporte-table.component.html',
  styleUrls: ['./viaje-transporte-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ViajeTransporteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public viajeData: ViajeTransporte[];
  public viajes: ReplaySubject<ViajeTransporte[]> = new ReplaySubject<ViajeTransporte[]>();
  public keywords: string = '';
  transportistaId: string;
  transportista: string;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private viajeTransporteService: ViajeTransporteService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.viajeTransporteService.activesByTransportista(this.transportistaId).subscribe((data) => {
      this.viajeData = data;
      this.viajes.next(data.slice());
    });
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];
    
    const data = history.state.data;

    if(data){
      this.transportista = data.nombre;
      sessionStorage.setItem('trans_nombre',data.nombre);
    }else{
      this.transportista = sessionStorage.getItem('trans_nombre')
    }

    if (this.transportistaId) {
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

    this.viajes.next(
      this.viajeData.filter(item => {
        if (
          item.nombre &&
          item.nombre
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 || !value
        ) {

          return true;
        }
      }).slice());
  }


  update(current: ViajeTransporte, event) {
    this.btnState = true;


    this.viajeTransporteService.update(current).subscribe(data => {
      this.btnState = false;
      this.successResponse('El Registro se', 'Actualizó')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });

  }

}

