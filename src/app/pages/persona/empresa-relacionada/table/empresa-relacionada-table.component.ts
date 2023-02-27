import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { EmpresaRelacionada, EmpresaRelacionadaService } from 'src/@sirio/domain/services/persona/empresa-relacionada/empresa-relacionada.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { EmpresaRelacionadaFormPopupComponent } from '../popup/empresa-relacionada-form.popup.component';

@Component({
  selector: 'sirio-persona-empresa-relacionada-table',
  templateUrl: './empresa-relacionada-table.component.html',
  styleUrls: ['./empresa-relacionada-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class EmpresaRelacionadaTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona=undefined;
  @Input() onRefresh:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);

  referencias: string[] = [];

  empresaRelacionadaList:ReplaySubject<EmpresaRelacionada[]> = new ReplaySubject<EmpresaRelacionada[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected empresaRelacionadaService: EmpresaRelacionadaService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }
  

  private loadList(){

    this.referencias = []

    this.empresaRelacionadaService.allByPersonaId(this.persona).subscribe((data) => {
            
      this.empresaRelacionadaList.next(data.slice());
      this.referencias = this.referencias.concat(data.map(t => t.identificacion));
      this.cdr.detectChanges();
    });
  }

  
  ngOnInit() {
    if(this.persona){
      this.loadList();

      this.onRefresh.subscribe(val=>{
        if(val){

          this.loadList();
        }
      })
    }
  }

  delete(row) {
    this.swalService.show('¿Desea eliminar Cliente/Proveedor?', undefined,
    // { 'html': ' <b>' + ', Banco: '+ row.entidadFinanciera + ', Cuenta: '+ row.numeroCuenta +'</b>' }).then((resp) => {

      { 'html': ' <b>' + row.relacionEmpresa +' : ' + row.empresa + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.empresaRelacionadaService.delete(row.id).subscribe(val=>{
            if(val){
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
    });
}

  ngAfterViewInit() {

  }

  popup(data?:EmpresaRelacionada) {
    if(data){
      data.persona=this.persona;
    }    
    //this.showFormPopup(EmpresaRelacionadaFormPopupComponent, !data?{persona:this.persona}:data,'60%').afterClosed().subscribe(event=>{
    this.showFormPopup(EmpresaRelacionadaFormPopupComponent, !data ? { persona: this.persona, referencias: this.referencias } : { ...data, ...{ referencias: this.referencias } }, '60%').afterClosed().subscribe(event => {
        if(event){
            this.onRefresh.next(true);
        }
    }); 
}


}
