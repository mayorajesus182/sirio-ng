import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../../@sirio/services/theme.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sirio-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  visible$ = this.themeService.config$.pipe(map(config => config.footerVisible));

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() {
  }

  hide() {
    this.themeService.setFooterVisible(false);
  }

  ngOnDestroy(): void {}
}
