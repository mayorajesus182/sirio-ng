import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ServicioComercial, ServicioComercialService } from 'src/@sirio/domain/services/gestion-comercial/servicio-comercial.service';
import { ServiciosPagoMovilFormPopupComponent } from '../popup/servicios-pago-movil-form.popup.component';

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
  public serviciosList = new BehaviorSubject<ServicioComercial[]>([]);
  public serviciosClienteList = new BehaviorSubject<ServicioComercial[]>([]);

  private principal: boolean = false;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private servicioComercialService: ServicioComercialService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }



  @ViewChildren('cardService') set cards(cardElements: QueryList<ElementRef>) {
    
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
          card.nativeElement.style.height = tallestHeight + 'px';
  
        });
  
  
        this.cdr.detectChanges();

      }, 500);
        
    }

  }

  private loadList() {

    this.servicioComercialService.asignedToPersona(this.persona.numper).subscribe(data => {
      this.serviciosClienteList.next(data);
    });

    this.servicioComercialService.noAsignedToPersona(this.persona.numper, this.persona.tipoPersona).subscribe(data => {
      this.serviciosList.next(data);
    });

  }

  ngOnInit() {

    if (this.persona) {
      this.loadList();
      

      console.log(' Personaaaaaaaaaaaaaaa ', this.persona);
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

  delete(row: any) {
    this.swalService.show('¿Desea Eliminar el Servicio?', undefined,
      { 'html': ' <b>' + row.nombre + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.successResponse('El Servicio', 'Eliminado', true);
        }
      });
  }

  view(data: any) {
  }


  popupPagoMovil(data: ServicioComercial) {

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


      this.serviciosList.value.forEach((e, index) => {
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