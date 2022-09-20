import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/@sirio/services/navigation.service';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';

@Component({
  selector: 'sirio-actions-nav',
  templateUrl: './actions-nav.component.html'
})
export class ActionsNavComponent implements OnInit {
  @Input('items') public items: Observable<SidenavItem[]> ;
  @Input('element') public element: any = {};
  @Output() eventClicked = new EventEmitter<boolean>();
  @Input('method') private method: MethodComponentApi
  menuItems:SidenavItem[]=[];
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private navService: NavigationService

  ) { }
  ngOnInit(): void {
    
    if (this.router) {

      const url = this.router.url;
      this.items.subscribe(data => {
         this.menuItems= data;
        // console.log('actions ', data);
        this.cdr.markForCheck();

      });
    }
  }

  callMethod(name: string) {
    this.method.invoke(this.element, name);
  }

  evalCondition(item) {
    if (!item.condition) {
      return true;
    }
    const stt = `${item.condition}`;
    return eval(stt);
  }

  applyColor(item) {

    if (!item.color) {
      return 'mat-color-primary';
    }

    let color = `${item.color}`;

    try {
      color = eval(color)
    } catch (error) {
      // no doing nothing
    }


    return 'mat-color-' + color;
  }

  getLabel(item) {

    let label = `${item.label}`;

    try {
      label = eval(label)
    } catch (error) {
      // no doing nothing
    }


    return label;
  }

}



export interface MethodComponentApi {
  invoke: (any, string) => void
}