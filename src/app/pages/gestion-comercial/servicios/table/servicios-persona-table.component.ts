import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ServiciosPersonaFormPopupComponent } from '../popup/servicios-persona-form.popup.component';

@Component({
  selector: 'sirio-servicios-persona-table',
  templateUrl: './servicios-persona-table.component.html',
  styleUrls: ['./servicios-persona-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ServiciosPersonaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

  
  serviciosList: any[] = [{
    name: 'Servicio 1',
    reumen: 'resumen S1'
  },
  {
    name: 'Servicio 2',
    reumen: 'resumen S2'
  },
  {
    name: 'Servicio 3',
    reumen: 'resumen S3'
  },
  {
    name: 'Servicio 4',
    reumen: 'resumen S4'
  }];
  serviciosClienteList: any[] = [
    {
      name: 'Servicio 5',
      reumen: 'resumen S5'
    },
  ];


  private principal: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    // protected direccionService: Servicio,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {

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


  edit(data: any) {
    console.log('data event click ', data);


  }

  delete(row:any) {
    this.swalService.show('¿Desea Eliminar Dirección?', undefined,
      { 'html': ' <b>' + row.descripcion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          console.log('buscando direccion', row.id);
          // this.direccionService.delete(row.id).subscribe(val=>{
          //         if(val){
          //           this.loadList();
          //         }
          //       })
          //       this.cdr.detectChanges();
        }
      });
  }

  view(data: any) {


  }


  popup(data?: Direccion) {

    if (data) {
      data.persona = this.persona;
    }
    this.updateDataFromValues(data, { principal: this.principal });
    let dir = data;

    console.log(dir);

    this.showFormPopup(ServiciosPersonaFormPopupComponent, !data ? { persona: this.persona, principal: this.principal } : dir, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {

    console.log('event drop',event);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}