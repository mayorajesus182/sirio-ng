import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { IntervinienteFormPopupComponent } from '../popup/interviniente-form.popup.component';

@Component({
  selector: 'sirio-persona-interviniente-table',
  templateUrl: './interviniente-table.component.html',
  styleUrls: ['./interviniente-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class IntervinienteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();

  intervinientes: ReplaySubject<Interviniente[]> = new ReplaySubject<Interviniente[]>();
  intervinienteList: Interviniente[] = [];
  
  private principal: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected intervinienteService: IntervinienteService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.intervinienteService.allByPersonaId(this.persona).subscribe((data) => {
      
      // this.interviniente.next(data.slice());
      // this.propagar.emit(data.length);
      // debo conocer si tengo una direccion principal
      //this.principal = data.filter(d => d.tipoDireccion == 'PRINCIPAL').length > 0;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('direcciones table');

    if (this.persona) {
      console.log('buscando direccion en el servidor dado el id persona');
      this.loadList();

      this.onRefresh.subscribe(val => {
        if (val) {

          this.loadList();
        }
      })
    }
  }

  ngAfterViewInit() {

  }

  edit(data: Interviniente) {
    console.log('data event click ', data);

  }

  delete(row) {
    this.swalService.show('¿Desea Eliminar Interviniente?', undefined,
    { 'html': ' <b>' + row.descripcion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          console.log('buscando interviniente',row.id);
          this.intervinienteService.delete(row.id).subscribe(val=>{
            if(val){
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
    });
}

  view(data: any) {

  }

  popup(data?: Interviniente) {
    
    if (data) {
      data.persona = this.persona;
    }
    this.updateDataFromValues(data, { principal: this.principal });
    let dir = data;

    console.log(dir);

    this.showFormPopup(IntervinienteFormPopupComponent, !data ? { persona: this.persona, principal: this.principal } : dir, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }
}