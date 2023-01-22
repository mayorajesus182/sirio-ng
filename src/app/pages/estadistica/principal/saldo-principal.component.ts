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
  regionTableData$: Observable<any[]>;
  acopioTableData$: Observable<any[]>;
  monedas: Moneda[] = [];
  coinAvailables: BehaviorSubject<Moneda[]> = new BehaviorSubject<any>({});
  detailCash: BehaviorSubject<any> = new BehaviorSubject<any>({});
  currentSiglasCoin:string=undefined;
  currentCoin:string=undefined;

  private acum:number=0;
  
  tableOptions = {
    pageSize: 10,
    columns: [
      { name: 'Cód.', property: 'agencia', visible: true, isModelProperty: true, width:'w-5' },
      { name: 'Nombre', property: 'agenciaNombre', visible: true, isModelProperty: true,width:'w-30', align:'text-left' },
      { name: 'Saldo', property: 'saldo', visible: true, isModelProperty: true, isNumber: true,width:'w-15' },
      { name: 'Cupo Min.', property: 'minimo', visible: true, isModelProperty: true, isNumber: true, width:'w-15'},
      { name: 'Cupo Max.', property: 'maximo', visible: true, isModelProperty: true, isNumber: true,width:'w-15' },
      { name: '% Cubierto', property: 'porcentaje', visible: true, isModelProperty: false, isNumber: true },
    ]
  };
  
  acopioTableOptions = {
    pageSize: 10,
    columns: [
      { name: 'Nombre', property: 'nombreTransportista', visible: true, isModelProperty: true,width:'w-60', align:'text-left',  },
      { name: 'Saldo Inicial', property: 'saldoInicial', visible: true, isModelProperty: true,isNumber:true, width:'w-20', align:'text-center',headerAlign:'header-center' },
      { name: 'Saldo Final', property: 'saldoFinal', visible: true, isModelProperty: true, isNumber: true,width:'w-20',align:'text-center',headerAlign:'header-center' }
    ]
  };


  constructor(
    private router: Router,
    private saldoPrincipalService: SaldoPrincipalService,
    private saldoTaquilla: SaldoTaquillaService) {

    super();
  }

  get total(){
    return this.acum;
  }

  refreshData() {

    this.saldoPrincipalService.datachart().subscribe(result => {

      console.log(result);

      this.regionTableData$ = of(result.data.regiones);
      let datasets_aument = {};
      let datasets_desmin = {};
      let datasets_final = {};
      let detailCash = {};
      
      this.monedas = result.data.monedas;
      
      this.coinAvailables.next(this.monedas);
      
      this.monedas.forEach(m => {
        
        datasets_aument[m.id] = result.data["aumento-" + m.id];
        
        datasets_desmin[m.id] = result.data["disminucion-" + m.id];
        datasets_final[m.id] = result.data["final-" + m.id];
        
        detailCash[m.id] = result.data["efectivo-" + m.id];
        this.currentSiglasCoin = this.currentSiglasCoin || m.siglas;
        this.currentCoin = this.currentCoin || m.id;
      });


      this.acopioTableData$ = of(result.data['acopios'].filter(s=> s.name= this.currentCoin).map(s=>s.data));

      let datasets = { series: [], labels: [] };
      let datasetDetailCash = { data: detailCash, labels: [], color: '#90ed7d', name: 'Disponible' };
      
      this.acum=datasets_final[this.currentCoin][datasets_final[this.currentCoin].length -1];
      console.log(datasets_final[this.currentCoin][datasets_final[this.currentCoin].length -1]);
      let data = result.data.acopios.filter(ac=>ac.name==this.currentCoin).map(ac=>ac.data).map((d,index)=>d[index]);
      // console.log(data);
      
      this.acopioTableData$ = of(data);
      
      // this.acopioTableData$.subscribe(d=>console.log(d));
      

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
      this.detailCash.next(datasetDetailCash);
      
    })
  }


  ngOnInit() {

    this.refreshData();
  }

  reload($event:any) {
    console.log('reload ',$event);
    this.acum=0;
    this.refreshData();
  }

  acumulate(event:number){
    this.acum+=event;
  }

}
