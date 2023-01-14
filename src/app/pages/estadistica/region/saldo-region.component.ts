import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { result } from 'lodash-es';
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
  currentMoneda:Moneda;
  agenciaTableData$: Observable<any[]>;
  dataResult:any=undefined;
  tableOptions = {
    pageSize: 6,
    columns: [
      { name: 'Cód.', property: 'agencia', visible: true, isModelProperty: true },
      { name: 'Nombre', property: 'agenciaNombre', visible: true, isModelProperty: true },
      { name: 'Saldo', property: 'saldo', visible: true, isModelProperty: true, isNumber: true },
      { name: 'Cupo Min.', property: 'minimo', visible: true, isModelProperty: true, isNumber: true },
      { name: 'Cupo Max.', property: 'maximo', visible: true, isModelProperty: true, isNumber: true },
      { name: '% Cubierto', property: 'porcentaje', visible: true, isModelProperty: false, isNumber: true },
    ]
  };


  constructor(
    private router: Router,
    private cdr:ChangeDetectorRef,
    private saldoRegionalService: SaldoRegionalService,
    private saldoTaquilla: SaldoTaquillaService) {

    super();
  }

  private rebuildChart(startIndex?:number,endIndex?:number){
    // let datasets_aument = {};
    //   let datasets_desmin = {};
    //   let datasets_final = {};
    //   let detailCash = {};
    //   let series = [];
    // console.log(startIndex);
    // console.log(endIndex);
    
    let datasets = { series: [], labels: [] };
  
    datasets.series = [
      {
        name: 'Cupo Max.',
        color: '#90ed7d',
        data: this.dataResult.data[this.currentMoneda.siglas].maximos.slice(startIndex, endIndex),
  
        pointPadding: 0.38,
        pointPlacement: -0.01,
      },
      {
        name: 'Cupo Min.',
        color: '#f4155c',
        data: this.dataResult.data[this.currentMoneda.siglas].minimos.slice(startIndex, endIndex),
        pointPadding: 0.3,
        pointPlacement: -0.01
      },
      {
        name: 'Saldo',
        color: '#28036a',
        data: this.dataResult.data[this.currentMoneda.siglas].serie.slice(startIndex, endIndex),
        pointPadding: 0.45,
        pointPlacement: -0.01,
        tooltip: {
          valuePrefix: 'Bs. ',
          valueSuffix: ''
        },
      }
    ];
  
    datasets.labels = this.dataResult.data.labels.slice(startIndex, endIndex);
  
    this.dataAgencia.next(datasets);

    this.cdr.detectChanges();

  }

  refreshData() {

    this.saldoRegionalService.datachart().subscribe(result => {

      // console.log(result);
      this.dataResult=result;

      this.agenciaTableData$ = of(result.data.detail)

      this.monedas = result.data.monedas;
      this.currentMoneda = this.monedas[0];

      this.coinAvailables.next(this.monedas);

      this.rebuildChart(0,this.tableOptions.pageSize);

    })
  }


  ngOnInit() {

    this.refreshData();
  }

  reload() {
    this.refreshData();
  }

  changedPage(page: any) {
    // console.log(page);

    const startIndex = page.pageIndex * page.pageSize;
    const endIndex = startIndex + page.pageSize;
  
    this.rebuildChart(startIndex,endIndex);
    // Create a new array of the integers for the current page
    // const pageOfIntegers = arrayOfIntegers.slice(startIndex, endIndex);


  }

}
