import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';


@Component({
  selector: 'sirio-taquilla-widget',
  templateUrl: './taquilla-widget.component.html',
  styleUrls: ['./taquilla-widget.component.scss']
})
export class TaquillaWidgetComponent implements OnInit {
  
  taquillas = new BehaviorSubject<SaldoTaquilla[]>([]);

  isLoading: boolean;

  constructor(private saldoTaquillaService: SaldoTaquillaService) {
    
  }

  ngOnInit(): void {
        
    this.reload();

  }

  reload() {
    this.isLoading = true;
    this.saldoTaquillaService.allByAgencia().subscribe(data=>{
      console.log('@@@@ saldo taquilla: ');
      console.log(data);
      this.taquillas.next(data);
      this.isLoading=false;
      
    })

    
  }
}
