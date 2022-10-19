import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Pep, PepService } from 'src/@sirio/domain/services/persona/pep/pep.service';
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

  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  pepList:ReplaySubject<Pep[]> = new ReplaySubject<Pep[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected pepService: PepService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList(){
    this.pepService.allByPersonaId(this.persona).subscribe((data) => {
      console.log(data);
      
      this.pepList.next(data.slice());
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log('pep table');
    
    if(this.persona){
      console.log('buscando pep en el servidor dado el id persona');
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


  edit(data: Pep) {
    //console.log('data event click ', data);

  }

  delete(data: Pep) {
    //console.log('data event click ', data);
    // if(data){

    // }
  }

  view(data: any) {


  }

  popup(data?:Pep) {
    console.log(data);
    if(data){
      data.persona=this.persona;
    }    
    this.showFormPopup(PepFormPopupComponent, !data?{persona:this.persona}:data,'60%').afterClosed().subscribe(event=>{
      console.log(event);
      
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}