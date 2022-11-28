import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { AccionistaDirectivo, AccionistaDirectivoService } from 'src/@sirio/domain/services/persona/accionista-directivo/accionista-directivo.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { AccionistaDirectivoFormPopupComponent } from '../popup/accionista-directivo-form.popup.component';

@Component({
  selector: 'sirio-persona-accionista-directivo-table',
  templateUrl: './accionista-directivo-table.component.html',
  styleUrls: ['./accionista-directivo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class AccionistaDirectivoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  accionistaDirectivoList:ReplaySubject<AccionistaDirectivo[]> = new ReplaySubject<AccionistaDirectivo[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected accionistaDirectivoService: AccionistaDirectivoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.accionistaDirectivoService.allByPersonaId(this.persona).subscribe((data) => {
            
      this.accionistaDirectivoList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('accionistaDirectivo table');
    
    if(this.persona){
      console.log('buscando Accionista Directivo en el servidor dado el id persona');
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


  edit(data: AccionistaDirectivo) {
    //console.log('data event click ', data);

  }

  delete(data: AccionistaDirectivo) {
    //console.log('data event click ', data);
    // if(data){

    // }
  }

  view(data: any) {


  }

  popup(data?:AccionistaDirectivo) {
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(AccionistaDirectivoFormPopupComponent, !data?{persona:this.persona}:data,'60%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}