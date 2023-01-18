import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ServiciosPagoMovilFormPopupComponent } from '../popup/servicios-pago-movil-form.popup.component';
import { ProductoComercial, ProductoComercialService } from 'src/@sirio/domain/services/gestion-comercial/producto-comercial.service';

@Component({
  selector: 'sirio-productos-persona-table',
  templateUrl: './productos-persona-table.component.html',
  styleUrls: ['./productos-persona-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ProductosPersonaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  public productosList = new BehaviorSubject<ProductoComercial[]>([]);
  public productosClienteList = new BehaviorSubject<ProductoComercial[]>([]);

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private productoComercialService: ProductoComercialService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {

    this.productoComercialService.asignedToPersona(this.persona.numper).subscribe(data => {
      this.productosClienteList.next(data);
    });

    this.productoComercialService.noAsignedToPersona(this.persona.numper, this.persona.tipoPersona).subscribe(data => {
      this.productosList.next(data);
    });

  }

  ngOnInit() {

    if (this.persona) {
      this.loadList();
    }
  }

  ngAfterViewInit() {

  }

  edit(data: any) {
    console.log('data event click ', data);
  }

  delete(row: any) {
    this.swalService.show('¿Desea Eliminar el Producto?', undefined,
      { 'html': ' <b>' + row.descripcion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          console.log('buscando direccion', row.id);
        }
      });
  }

  view(data: any) {
  }


  popupPagoMovil(data: ProductoComercial) {

    if (!data) {
      return;
    }

    // this.updateDataFromValues(data, { principal: this.principal });
    // let dir = data;

    this.showFormPopup(ServiciosPagoMovilFormPopupComponent, { persona: this.persona, servicio: data }, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      console.log('event drop', event);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('event drop2222', event.previousContainer);


      this.productosList.value.forEach((e, index) => {
        if (index == event.previousIndex) {
          this.popupPagoMovil(e);
        }
        this.cdr.detectChanges();
      });





      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}