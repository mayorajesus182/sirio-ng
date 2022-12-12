import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoRegionalService } from 'src/@sirio/domain/services/control-efectivo/saldo-regional.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { ChartBaseComponent } from 'src/@sirio/shared/base/chart-base.component';

@Component({
  selector: 'sirio-saldo-region-statics',
  templateUrl: './saldo-region.component.html',
  styleUrls: ['./saldo-region.component.scss']
})
export class SaldoRegionComponent extends ChartBaseComponent implements OnInit {

  private static isInitialLoad = true;
  dataAgencia: BehaviorSubject<any> = new BehaviorSubject<any>({});
  detailAgencia: BehaviorSubject<any> = new BehaviorSubject<any>({});
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  
  agenciaTableData$: Observable<any[]>;
  tableOptions = {
    pageSize: 15,
    columns: [
      { name: 'Agencia', property: 'agencia', visible: true, isModelProperty: true },
      { name: 'Saldo', property: 'saldo', visible: true, isModelProperty: true,isNumber:true },
      { name: 'Cupo Min.', property: 'minimo', visible: true, isModelProperty: true,isNumber:true },
      { name: 'Cupo Max.', property: 'maximo', visible: true, isModelProperty: true,isNumber:true },
      { name: '%', property: 'porcentaje', visible: true, isModelProperty: false,isNumber:true },
    ]
  };


  constructor(
    private router: Router,
    private saldoRegionalService: SaldoRegionalService,
    private saldoTaquilla: SaldoTaquillaService) {

    super();
  }

  refreshData() {

    this.saldoRegionalService.datachart().subscribe(result => {

      console.log(result);

      this.agenciaTableData$ = of(result.data.detail)

      let datasets_aument = {};
      let datasets_desmin = {};
      let datasets_final = {};
      let detailCash = {};
      let series = [];

      this.monedas = result.data.monedas;
      const currentMoneda=this.monedas[0];

      this.coinAvailables.next(this.monedas);

      // this.monedas.forEach(m => {

      //   datasets_aument[m.id] = result.data["aumento-" + m.id];

      //   datasets_desmin[m.id] = result.data["disminucion-" + m.id];
      //   datasets_final[m.id] = result.data["final-" + m.id];

      //   detailCash[m.id] = result.data["detail-" + m.id];
      // });
      let datasets = { series: [], labels: [] };
      // let datasetDetail = { data: detailCash, labels: [], color: '#90ed7d', name: 'Disponible' };

      // console.log(datasetDetail);


      // REGI2

      datasets.series = [
        {
         name: 'Cupo Max.',
         color: '#90ed7d',
         data: result.data[currentMoneda.siglas].maximos,
         
         pointPadding: 0.38,
         pointPlacement: -0.01,
       },
        {
          name: 'Cupo Min.',
          color: '#f4155c',
          data: result.data[currentMoneda.siglas].minimos,
          pointPadding: 0.3,
          pointPlacement: -0.01
        },
        {
          name: 'Saldo',
          color: '#28036a',
          data: result.data[currentMoneda.siglas].serie,
          pointPadding: 0.45,
          pointPlacement: -0.01,
          tooltip: {
            valuePrefix: 'Bs. ',
            valueSuffix: ''
          },
        }
      ]


      datasets.labels = result.data.labels;

      // datasets.series = [
      //   {
      //     name: 'Aumenta',
      //     data: datasets_aument,
      //     color: '#90ed7d'
      //   },
      //   {
      //     name: 'Disminuye',
      //     data: datasets_desmin,
      //     color: '#f45b5b'
      //   },
      //   {
      //     name: 'Saldo Final',
      //     data: datasets_final,
      //     color: '#28036a'
      //   },
      // ]

      // datasets.labels = result.data.labels;


      this.dataAgencia.next(datasets);
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
