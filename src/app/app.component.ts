import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { RoutePartsService } from 'src/@sirio/services/route-parts.service';
import { SplashScreenService } from '../@sirio/services/splash-screen.service';
import { ThemeService } from '../@sirio/services/theme.service';

@Component({
  selector: 'sirio-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

  appTitle = 'Sirio By Novumideas';
  pageTitle = '';


  constructor(
    public title: Title,
    private router: Router,
    private routePartsService: RoutePartsService,
    private activeRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private renderer: Renderer2,
    private themeService: ThemeService,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private platform: Platform,
    private splashScreenService: SplashScreenService) {
   
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


    // console.log('set title ',this.appTitle);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      const routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length) {
        return this.title.setTitle(this.appTitle);
      }
      // Extract title from parts;
      this.pageTitle = routeParts
                      .reverse()
                      .map((part) =>{
                        console.log('tl ',this.translate.instant(part.title));
                        
                      return   this.translate.instant(part.title) 
                      
                      })                      
                      .reduce((partA, partI) => {return `${partA} > ${partI}`});
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);

      
    });
    console.log('set title ',this.appTitle);
  }
}
