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

  public viajes: ReplaySubject<ViajeTransporte[]> = new ReplaySubject<ViajeTransporte[]>();
  
  transportistaId: string;
  transportista: string;
  datosPersona: string;

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
      this.viajes.next(data.slice());
      this.cdr.markForCheck();

      console.log(data);
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



  activateOrInactivate(row: ViajeTransporte) {
    if (!row || row.costo<=0) {
      return;
    }

    this.applyChangeStatus(this.viajeTransporteService, row, row.viaje, this.cdr);
  }

}

