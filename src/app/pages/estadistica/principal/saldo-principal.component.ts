import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoPrincipalService } from 'src/@sirio/domain/services/control-efectivo/saldo-principal.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';

@Component({
  selector: 'sirio-saldo-principal-statics',
  templateUrl: './saldo-principal.component.html',
  styleUrls: ['./saldo-principal.component.scss']
})
export class SaldoPrincipalComponent extends ChartBaseComponent implements OnInit {

  private static isInitialLoad = true;
  data$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  // detailAgencia: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  
  agenciaTableData$: Observable<any[]>;
  tableOptions = {
    pageSize: 15,
    columns: [
      { name: 'Cód.', property: 'agencia', visible: true, isModelProperty: true },
      { name: 'Nombre', property: 'agenciaNombre', visible: true, isModelProperty: true },
      { name: 'Saldo', property: 'saldo', visible: true, isModelProperty: true,isNumber:true },
      { name: 'Cupo Min.', property: 'minimo', visible: true, isModelProperty: true,isNumber:true },
      { name: 'Cupo Max.', property: 'maximo', visible: true, isModelProperty: true,isNumber:true },
      { name: '% Cubierto', property: 'porcentaje', visible: true, isModelProperty: false,isNumber:true },
    ]
  };


  constructor(
    private router: Router,
    private saldoPrincipalService: SaldoPrincipalService,
    private saldoTaquilla: SaldoTaquillaService) {

    super();
  }

  refreshData() {

    this.saldoPrincipalService.datachart().subscribe(result => {

      console.log(result);

      this.agenciaTableData$ = of(result.data.detail)
      let datasets_aument = {};
      let datasets_desmin = {};
      let datasets_final = {};
      let detailCash = {};
      let series = [];

      this.monedas = result.data.monedas;

      this.coinAvailables.next(this.monedas);

      this.monedas.forEach(m => {

        datasets_aument[m.id] = result.data["aumento-" + m.id];

        datasets_desmin[m.id] = result.data["disminucion-" + m.id];
        datasets_final[m.id] = result.data["final-" + m.id];

        detailCash[m.id] = result.data["detail-" + m.id];
      });
      let datasets = { series: [], labels: [] };
      // let datasetDetail = { data: detailCash, labels: [], color: '#90ed7d', name: 'Disponible' };

      // console.log(datasetDetail);


      datasets.series = [
        {
          name: 'Aumenta',
          data: datasets_aument,
          color: '#90ed7d'
        },
        {
          name: 'Disminuye',
          data: datasets_desmin,
          color: '#f45b5b'
        },
        {
          name: 'Saldo Final',
          data: datasets_final,
          color: '#28036a'
        },
      ]

      datasets.labels = result.data.labels;


      this.data$.next(datasets);
      // this.detailAgencia.next(datasetDetail);
    })
  }


  ngOnInit() {

    this.refreshData();
  }

  reload() {
    this.refreshData();
  }

}
