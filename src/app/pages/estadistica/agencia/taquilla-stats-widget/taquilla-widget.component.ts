import { Component, OnInit } from '@angular/core';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';


@Component({
  selector: 'sirio-taquilla-widget',
  templateUrl: './taquilla-widget.component.html',
  styleUrls: ['./taquilla-widget.component.scss']
})
export class TaquillaWidgetComponent implements OnInit {
  
  data: any;

  isLoading: boolean;

  constructor(private saldoAgencia: SaldoAgenciaService) {
  }

  ngOnInit(): void {
        

  }

  reload() {
    this.isLoading = true;
    this.saldoAgencia.getSaldo().subscribe(data=>{
      console.log('@@@@ saldo: ');
      console.log(data);
      data = data;
      
    })

    
  }
}
