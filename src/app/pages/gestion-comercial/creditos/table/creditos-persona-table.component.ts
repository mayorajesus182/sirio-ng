import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { CreditoInformacionFormPopupComponent } from '../popup/credito-informacion-form.popup.component';
import { CreditoComercial, CreditoComercialService } from 'src/@sirio/domain/services/gestion-comercial/credito-comercial.service';
import { CreditoDataFormPopupComponent } from '../popup/credito-data-form.popup.component';

@Component({
  selector: 'sirio-creditos-persona-table',
  templateUrl: './creditos-persona-table.component.html',
  styleUrls: ['./creditos-persona-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class CreditosPersonaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  public creditosList = new BehaviorSubject<CreditoComercial[]>([]);
  public creditosClienteList = new BehaviorSubject<CreditoComercial[]>([]);

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private creditoComercialService: CreditoComercialService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }




  @ViewChildren('cardCredit') set cards(cardElements: QueryList<ElementRef>) {
    
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

    this.creditoComercialService.asignedToPersona(this.persona.numper).subscribe(data => {
      this.creditosClienteList.next(data);
    });

    this.creditoComercialService.noAsignedToPersona(this.persona.numper, this.persona.tipoPersona).subscribe(data => {
      this.creditosList.next(data);
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
    this.popupData(data);
  }

  sendData(row: any) {
    this.successResponse('La Información del Crédito', 'Enviada', true);
  }

  view(data: any) {
  }


  popupRequisito(data: CreditoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(CreditoInformacionFormPopupComponent, { persona: this.persona, servicio: data }, '50%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }

  popupData(data: CreditoComercial) {

    if (!data) {
      return;
    }

    this.showFormPopup(CreditoDataFormPopupComponent, { persona: this.persona, servicio: data }, '50%').afterClosed().subscribe(event => {
      if (event) {
        this.loadList();
      }
    });
  }


  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.creditosList.value.forEach((e, index) => {
        if (index == event.previousIndex) {
          this.popupRequisito(e);
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