import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ReferenciaBancaria } from 'src/@sirio/domain/services/persona/referencia-bancaria/referencia-bancaria.service';
import { ReferenciaPersonal, ReferenciaPersonalService } from 'src/@sirio/domain/services/persona/referencia-personal/referencia-personal.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ReferenciaPersonalFormPopupComponent } from '../popup/referencia-personal-form.popup.component';



@Component({
  selector: 'sirio-persona-referencia-personal-table',
  templateUrl: './referencia-personal-table.component.html',
  styleUrls: ['./referencia-personal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ReferenciaPersonalTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  referenciaPersonalList:ReplaySubject<ReferenciaPersonal[]> = new ReplaySubject<ReferenciaPersonal[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected referenciaPersonalService: ReferenciaPersonalService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }
  
  private loadList(){
    this.referenciaPersonalService.allByPersonaId(this.persona).subscribe((data) => {
           
      console.log(data);
      this.referenciaPersonalList.next(data.slice());
      
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('referencia personal table');
    
    if(this.persona){
      
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



  popup(data?:ReferenciaBancaria) {
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(ReferenciaPersonalFormPopupComponent, !data?{persona:this.persona}:data,'40%').afterClosed().subscribe(event=>{
            
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}