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

      this.empleados.next(data.slice());
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];
    
    const data = history.state.data;// obteniendo data del state

    if(data){
      // en caso que venga data la guardo en el session storage
      // sessionStorage.setItem('id',data.codigo);
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
    // this.afterInit();
  }

  ngOnDestroy() {

  }

  openPopup(data:any) {
    // this.dialogoPopup = this.dialog.open(EmpleadoTransportePopupComponent, {
    //   panelClass: 'form-dialog',
    //   width: '70%',
    //   disableClose: true,
    //   data: { payload: { id: this.transportistaId,data:{} }, isNew: true }
    // });

    // this.dialogoPopup.afterClosed().subscribe(res => {
    //   if (res)
    //     this.loadList();
    // });
    if(data){

      data.transportista = this.transportistaId;
    }

    this.showFormPopup(EmpleadoTransportePopupComponent,data||{transportista:this.transportistaId},'50%');

    this.dialogRef.afterClosed().subscribe(event=>{

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

