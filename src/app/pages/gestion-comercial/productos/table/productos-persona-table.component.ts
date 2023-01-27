import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ProductoComercial, ProductoComercialService } from 'src/@sirio/domain/services/gestion-comercial/producto-comercial.service';
import { ProductoCuentaRegistroFormPopupComponent } from '../popup/cuenta_bancaria/producto-cuenta-registro-form.popup.component';
import { ProductoCuentaDataFormPopupComponent } from '../popup/cuenta_bancaria/producto-cuenta-data-form.popup.component';
import { ProductoPlazoFijoDataFormPopupComponent } from '../popup/plazo_fijo/producto-plazofijo-data-form.popup.component';
import { ProductoTDCDataFormPopupComponent } from '../popup/tdc/producto-tdc-data-form.popup.component';
import { ProductoTDCSolicitudFormPopupComponent } from '../popup/tdc/producto-tdc-solicitud-form.popup.component';

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

  // @ViewChildren('cardProduct') cardElements;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private productoComercialService: ProductoComercialService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  @ViewChildren('cardProduct') set cards(cardElements: QueryList<ElementRef>) {
    // console.log('paginators');
    // console.log(mps);
    // console.log('end paginators');
    if (cardElements) {

      
      setTimeout(() => {
        let tallestHeight = 0;
        
        cardElements.forEach((card) => {
          // console.log(card.nativeElement);
  
          if (card.nativeElement.offsetHeight > tallestHeight) {
            tallestHeight = card.nativeElement.offsetHeight;
          }
        });
  
        // Set all card elements to the same height
        cardElements.forEach((card) => {
          // card.nativeElement.style.height = tallestHeight + 'px';
  
        });
  
  
        this.cdr.detectChanges();

      }, 500);
        
    }

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
    if (data.tipo == 'DPF') {
      this.popupViewPlazoFijo(data);
    } else if (data.tipo == 'CTA') {
      this.popupViewCuenta(data);
    } else if (data.tipo == 'TDC') {
      this.popupViewTDC(data);
    }
  }

  sendData(row: any) {
    this.successResponse('La Información', 'Enviada', true);
  }

  view(data: any) {
  }


  popupRegistroCuenta(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoCuentaRegistroFormPopupComponent, { persona: this.persona, servicio: data }, '70%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }


  popupSolicitudTDC(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoTDCSolicitudFormPopupComponent, { persona: this.persona, servicio: data }, '50%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }

  popupViewCuenta(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoCuentaDataFormPopupComponent, { persona: this.persona, servicio: data }, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }

  popupViewPlazoFijo(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoPlazoFijoDataFormPopupComponent, { persona: this.persona, servicio: data }, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }

  popupViewTDC(data: ProductoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(ProductoTDCDataFormPopupComponent, { persona: this.persona, servicio: data }, '60%').afterClosed().subscribe(event => {
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
          if (e.tipo == 'TDC') {
            this.popupSolicitudTDC(e);
          } else if (e.tipo == 'CTA') {
            this.popupRegistroCuenta(e);
          }
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