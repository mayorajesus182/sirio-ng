import { AfterViewChecked, ChangeDetectorRef, Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from 'src/@sirio/services/session.service';
import { ThemeService } from '../../../@sirio/services/theme.service';
import { SidenavItem } from './sidenav-item/sidenav-item.interface';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'sirio-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewChecked {

  sidenavUserVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)//this.themeService.config$.pipe(map(config => config.sidenavUserVisible));

  @Input()
  @HostBinding('class.collapsed')
  collapsed: boolean;

  @Input()
  @HostBinding('class.expanded')
  expanded: boolean;

  items$: Observable<SidenavItem[]>;

  fullName: string;
  officeName: string;
  logonedAt: any;

  constructor(private router: Router,
    private sessionService: SessionService,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    private cdref : ChangeDetectorRef) {
  }
  ngAfterViewChecked(): void {
    
    // this.sidenavUserVisible$.next(!this.collapsed);
    this.cdref.detectChanges();
  }

  ngOnInit() {
    this.items$ = this.sidenavService.items$
    this.toggleCollapsed();

    const data = this.sessionService.getUser();

    if (data && data.username) {
      console.log("User session", data);
      this.officeName = data.organization;
      this.fullName = data.fullName.split(" ")[0];
      this.logonedAt = data.prevLogin;
    }


    // this.sidenavUserVisible$.subscribe(status=>{

    //   console.log('show ',status);
    // })
    
    // this.sidenavService.expanded$.subscribe(expanded=>{
    //   // console.log('expanded',expanded);
    //   if(!this.collapsed){
    //     this.sidenavUserVisible$.next(expanded);
    //   }
      
    // });

    // this.sidenavService.collapsed$.subscribe(collapsed=>{
    //     if(!this.expanded){
    //       this.sidenavUserVisible$.next(collapsed);
    //     }
      
    // });
    // this.cdref.markForCheck();
  }

  toggleCollapsed() {
    this.sidenavService.toggleCollapsed();    
  }

  @HostListener('mouseenter')
  @HostListener('touchenter')
  onMouseEnter() {
    this.sidenavService.setExpanded(true);
    // this.sidenavUserVisible$.next(true);
    // this.cdref.detectChanges();
  }

  @HostListener('mouseleave')
  @HostListener('touchleave')
  onMouseLeave() {
    this.sidenavService.setExpanded(false);
    // this.sidenavUserVisible$.next(false);
    // this.cdref.detectChanges();
  }

  ngOnDestroy() {
  }
}
