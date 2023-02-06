import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { NavigationService } from 'src/@sirio/services/navigation.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';

@Component({
  selector: 'sirio-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  /**
     * Needed for the Layout
     */
  private _gap = 16;
  gap = `${this._gap}px`;
  private itemDataSubject = new ReplaySubject<SidenavItem[]>(0);
  items$: Observable<SidenavItem[]> = this.itemDataSubject.asObservable();

  constructor(
    private sessionService: SessionService,
    private navService: NavigationService,
  ) { }

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  ngOnInit() {
    const user = this.sessionService.getUser() as User;

    this.navService.get(user.username.toLowerCase()).subscribe(data => {
      this.itemDataSubject.next(data);
    })

  }

}
