import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ReferenciaBancaria, ReferenciaBancariaService } from 'src/@sirio/domain/services/persona/referencia-bancaria/referencia-bancaria.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ReferenciaBancariaFormPopupComponent } from '../popup/referencia-bancaria-form.popup.component';


@Component({
  selector: 'sirio-persona-referencia-bancaria-table',
  templateUrl: './referencia-bancaria-table.component.html',
  styleUrls: ['./referencia-bancaria-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ReferenciaBancariaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  referenciaBancariaList:ReplaySubject<ReferenciaBancaria[]> = new ReplaySubject<ReferenciaBancaria[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected referenciaBancariaService: ReferenciaBancariaService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }
  
  private loadList(){
    this.referenciaBancariaService.allByPersonaId(this.persona).subscribe((data) => {
           
      this.referenciaBancariaList.next(data.slice());
      this.propagar.emit(data.length);
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('referencia bancaria table');
    
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
    this.showFormPopup(ReferenciaBancariaFormPopupComponent, !data?{persona:this.persona}:data,'40%').afterClosed().subscribe(event=>{
            
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}