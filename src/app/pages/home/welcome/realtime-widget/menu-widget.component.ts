import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'sirio-menu-widget',
  templateUrl: './menu-widget.component.html',
  styleUrls: ['./menu-widget.component.scss']
})
export class MenuWidgetComponent implements OnInit, AfterViewInit {

  @Input() pages$: Observable<SidenavItem[]>;

  @Input() name = 'Modulo Name';
  @Input() prefix_page = '';
  @Input() icon = 'fa-regular fa-link-slash';

  @Input() total: number;
  @Input() class_bg: 'blue-bg' | 'indigo-bg' | 'green-bg' | 'teal-bg' = 'indigo-bg';

  app = "Sirio";
  constructor(
    translate: TranslateService,
    private cdref: ChangeDetectorRef) {
  }
  ngOnInit(): void {

    if (!environment.production) {
      this.app = '';
    }
  }

  ngAfterViewInit() {

    let first = true;


  }

  availablePage(view: string) {
    if (!view) {
      return;
    }

    return view.indexOf(this.prefix_page) == 0;
  }

}
