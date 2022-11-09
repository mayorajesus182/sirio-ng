import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';

@Component({
  selector: 'sirio-menu-widget',
  templateUrl: './menu-widget.component.html',
  styleUrls: ['./menu-widget.component.scss']
})
export class MenuWidgetComponent implements  AfterViewInit {

  @Input() pages$: Observable<SidenavItem[]>;
  
  @Input() name = 'Modulo Name';
  @Input() prefix_page = '';
  @Input() icon = 'fa-regular fa-link-slash';

  @Input() total: number;
  @Input() class_bg: 'blue-bg'|'indigo-bg'|'green-bg'|'teal-bg'='indigo-bg';

  constructor(
    translate:TranslateService,
    private cdref: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
   
    let first = true;

    // this.pages$.subscribe(data=>{
    //   // console.log(' data widget ',data);
      
    // });
   
  }

  availablePage(view:string){
    if(!view){
      return;
    }
    
    return view.indexOf(this.prefix_page) == 0;
  }

}
