import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, 
        EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfConstants } from 'src/@sirio/constants';
import { NavigationService } from 'src/@sirio/services/navigation.service';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';

@Component({
  selector: 'sirio-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.scss']
})
export class ButtonAddComponent implements OnInit, AfterViewInit {


  @Input() tooltips: string;
  button: SidenavItem;

  @ViewChild('btnClicked') btnClicked: ElementRef;
  @Output() eventClicked = new EventEmitter<string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private navService: NavigationService
  ) { }


  ngOnInit(): void {

    if (this.router) {

      const url = this.router.url;
      this.navService.getButtons(url.substring(ApiConfConstants.APP_NAME.length)).subscribe(data => {
        console.log('button add action ',data);
        
        if (data.length > 0) {
          this.button = data[0];
          this.cdr.detectChanges();
        }
      });
    }

  }

  ngAfterViewInit(): void {
    // fromEvent(this.btnClicked.nativeElement, 'click').pipe(
    //   distinctUntilChanged(),
    //   debounceTime(150)
    // ).subscribe(() => {
    //   this.eventClicked.emit(true);
    // });
  }



}
