import { T } from '@angular/cdk/keycodes';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Pep, PepService } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { PepFormPopupComponent } from '../popup/pep-form.popup.component';

@Component({
  selector: 'sirio-persona-pep-table',
  templateUrl: './pep-table.component.html',
  styleUrls: ['./pep-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class PepTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona:Persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  pepList: ReplaySubject<Pep[]> = new ReplaySubject<Pep[]>();
  peps: any[] = [];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected pepService: PepService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.peps = []
    this.pepService.allByPersonaId(this.persona.id).subscribe((data) => {
      // console.log('buscando data cliente',data);
      
      this.pepList.next(data.slice());
      // t.tipoDocumento+'-'+
      this.peps = data.map(t => {return {identificacion:t.tipoDocumento+'-'+t.identificacion,tipo:t.tipoPep}});
      
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    if (this.persona) {
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

  delete(row) {
    this.swalService.show('¿Desea Eliminar Persona Expuesta Políticamente (PEP)?', undefined,
      { 'html': ' <b>' + row.nombre + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.pepService.delete(row.id).subscribe(val => {
            if (val) {
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
      });
  }

  popup(data?: Pep) {
    if (data) {
      data.persona = this.persona.id;
    }

    console.log('buscando data peps',this.peps);

    console.log('buscando data persona',this.persona);

    this.showFormPopup(PepFormPopupComponent, !data ? { persona: this.persona , peps: this.peps , nombre: this.persona.nombre , tipoDocumento: this.persona.tipoDocumento } : { ...data, ...{ peps: this.peps } }, '60%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }
}
