import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { Idioma } from 'src/@sirio/domain/services/preferencias/idioma.service';
import { BroadcastService, BROADCAST_SERVICE } from 'src/@sirio/services/broadcast.service';
import { RoutePartsService } from 'src/@sirio/services/route-parts.service';
import { SplashScreenService } from '../@sirio/services/splash-screen.service';
import { ThemeService } from '../@sirio/services/theme.service';

@Component({
  selector: 'sirio-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

  appTitle = 'Sirio By Novumideas';
  pageTitle = '';
  tabCounter = 1;
  
  @HostListener('mousewheel', ['$event'])
  onMousewheel(event: WheelEvent) {
    if (event.ctrlKey) {
      // console.log('mousewheel event ',event);
      event.preventDefault();
    }
  }

  @HostListener('document:keydown', ['$event'])
  disableZoomKeys(event: KeyboardEvent) {
    // console.log(event);
    
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-')) {
      event.preventDefault();
    }
  }

  // @HostListener('document:wheel', ['$event'])
  // disableZoomWheel(event: WheelEvent) {
  //   if (event.ctrlKey || event.metaKey) {
      
  //     event.preventDefault();
  //   }
  // }


  @HostListener('document:gesturestart', ['$event'])
  disableZoomGestureStart(event: TouchEvent) {
    event.preventDefault();
  }

  @HostListener('document:gesturechange', ['$event'])
  disableZoomGestureChange(event: TouchEvent) {
    event.preventDefault();
  }



  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService,
    public title: Title,
    private router: Router,
    private routePartsService: RoutePartsService,
    private activeRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private renderer: Renderer2,
    private themeService: ThemeService,
    public translate: TranslateService,
    private platform: Platform,
    private splashScreenService: SplashScreenService) {

    this.disableZoomKeys = this.disableZoomKeys.bind(this);

    // Translator init
    const browserLang: string = translate.getBrowserLang();

    var lang = 'es';
    if (localStorage.getItem('sirio-lang')) {
      lang = (JSON.parse(localStorage.getItem('sirio-lang')) as Idioma).id.toLowerCase();
    }


    translate.use(browserLang.match(/en|es|pr/) ? browserLang : lang);

    this.activeRoute.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.themeService.setStyle(queryParamMap.get('style')));

    this.iconRegistry.setDefaultFontSetClass('material-icons-outlined');
    this.themeService.theme$.subscribe(theme => {
      if (theme[0]) {
        this.renderer.removeClass(this.document.body, theme[0]);
      }

      this.renderer.addClass(this.document.body, theme[1]);
    });

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

  }


  ngOnInit() {

    this.changePageTitle();
  }

  ngAfterViewInit() {
  }

  changePageTitle() {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      const routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length) {
        return this.title.setTitle(this.appTitle);
      }
      // Extract title from parts;
      this.pageTitle = routeParts
        .reverse()
        .map((part) => {

          let title = this.translate.instant(part.title);

          // console.log('tl ', title);

          return title;

        })
        .reduce((partA, partI) => { return `${partA} > ${partI}` });
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);


      console.log('update title ', this.appTitle);

    });


    setTimeout(() => {
      this.tabCounter++;
      this.broadCastService.publish({
        type: 'counter',
        payload: this.tabCounter
      })

    }, 1000);
  }
}
