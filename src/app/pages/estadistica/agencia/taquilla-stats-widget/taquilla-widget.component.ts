import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { TaquillaChartPopupComponent } from '../taquilla-resumen/popup/taquilla-chart.popup.component';


@Component({
  selector: 'sirio-taquilla-widget',
  templateUrl: './taquilla-widget.component.html',
  styleUrls: ['./taquilla-widget.component.scss']
})
export class TaquillaWidgetComponent implements OnInit {

  taquillas = new BehaviorSubject<any[]>([]);
  saldos: SaldoTaquilla[];
  // taquillas = new BehaviorSubject<any[]>([]);

  isLoading: boolean;


  constructor(
    protected dialog: MatDialog,
    private saldoTaquillaService: SaldoTaquillaService) {

  }

  ngOnInit(): void {

    this.reload();

  }

  reload() {
    this.isLoading = true;
    this.saldoTaquillaService.allByAgencia().subscribe(data => {
      // console.log('@@@@ saldo taquilla: ');
      console.log(data);
      this.saldos = data;

      let lista = data.map(e => {
        let p = {id:e.taquilla, taquilla: e.taquillaNombre, usuario: e.taquillaUsuario };
        return p;
      }).filter(this.onlyUnique);

      this.taquillas.next(lista);
      this.isLoading = false;
    });


  }

  private onlyUnique(value, index, self) {

    return self.findIndex(v => value.taquilla == v.taquilla) === index;
  }

  openStats(taquilla, nombre) {
    // this.showFormPopup(TaquillaChartPopupComponent, {id:taquilla}, '60%');
    let datos = { payload: {id:taquilla, nombre:nombre} };

    this.dialog.open(TaquillaChartPopupComponent, {
      panelClass: 'dialog-frame',
      width: '60%',
      disableClose: true,
      data: datos
    });
  }

}
