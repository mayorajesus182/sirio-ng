import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/@sirio/services/session.service';

@Component({
  selector: 'sirio-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {

  isOpen: boolean;

  username: string;

  constructor(
     public sessionService: SessionService,

  ) { }

  ngOnInit() {

    const data = this.sessionService.getUser();

    if (data && data.username) {
      // console.log("User session", data);
      this.username = data.username;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

}
