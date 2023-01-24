import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ProductoCuentaRegistroFormPopupComponent } from '../popup/producto-cuenta-registro-form.popup.component';
import { ProductoComercial, ProductoComercialService } from 'src/@sirio/domain/services/gestion-comercial/producto-comercial.service';
import { ProductoCuentaDataFormPopupComponent } from '../popup/producto-cuenta-data-form.popup.component';

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

  @ViewChildren('cardProduct') cardElements;

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

    let tallestHeight = 0;
    this.cardElements.forEach((card) => {
      // console.log(card);
      
      if (card.nativeElement.offsetHeight > tallestHeight) {
        tallestHeight = card.nativeElement.offsetHeight;
      }
    });

    // Set all card elements to the same height
    this.cardElements.forEach((card) => {
      card.nativeElement.style.height = tallestHeight + 'px';
      this.cdr.detectChanges();
    });

  }

  edit(data: any) {
    this.popupData(data);
  }

  sendData(row: any) {
    this.successResponse('La Información de la Cuenta', 'Enviada', true);
  }

  view(data: any) {
  }


  popupRegistro(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoCuentaRegistroFormPopupComponent, { persona: this.persona, servicio: data }, '70%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }

  popupData(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoCuentaDataFormPopupComponent, { persona: this.persona, servicio: data }, '50%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.productosList.value.forEach((e, index) => {
        if (index == event.previousIndex) {
          this.popupRegistro(e);
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