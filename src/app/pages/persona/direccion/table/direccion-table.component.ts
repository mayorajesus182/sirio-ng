import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';

@Component({
  selector: 'sirio-persona-direccion-table',
  templateUrl: './direccion-table.component.html',
  styleUrls: ['./direccion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class DireccionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  direcciones:ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected direccionService: DireccionService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.direccionService.allByPersonaId(this.persona).subscribe((data) => {
      this.direcciones.next(data.slice());
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('direcciones table');
    
    if(this.persona){
      console.log('buscando direccion en el servidor dado el id persona');
      this.loadList();


      this.onRefresh.subscribe(val=>{
        if(val){

          this.loadList();
        }
      })
    }
  }

  ngAfterViewInit() {

  }


  edit(data: Direccion) {
    console.log('data event click ', data);


  }

  delete(data: Direccion) {
    console.log('data event click ', data);
    // if(data){

    // }
  }

  view(data: any) {


  }


}