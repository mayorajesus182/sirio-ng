import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';


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


  constructor(private saldoTaquillaService: SaldoTaquillaService) {

  }

  ngOnInit(): void {

    this.reload();

  }

  reload() {
    this.isLoading = true;
    this.saldoTaquillaService.allByAgencia().subscribe(data => {
      console.log('@@@@ saldo taquilla: ');
      console.log(data);
      this.saldos =data;
      // data.map(e => {
      //   let p = { taquilla: e.taquillaNombre, usuario: e.taquillaUsuario };
      //   return p;
      // });
      let lista = data.map(e => {
        let p = { taquilla: e.taquillaNombre, usuario: e.taquillaUsuario };
        return p;
      }).filter(this.onlyUnique);

      console.log('header taquilla ',lista);
      

      this.taquillas.next(lista);
      this.isLoading = false;
    })


  }

  private onlyUnique(value, index, self) {
    // console.log('index ',index);
    // console.log('self ',self);
    // console.log('value ',value, self.findIndex(v=> value.taquilla==v.taquilla));
    
    return self.findIndex(v=> value.taquilla==v.taquilla) === index;
  }

}
