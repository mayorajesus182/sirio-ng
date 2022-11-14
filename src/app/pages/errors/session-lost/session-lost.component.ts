import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';

@Component({
  selector: 'app-session-lost',
  templateUrl: './session-lost.component.html',
  styleUrls: ['./session-lost.component.scss']
})
export class SessionLostComponent implements OnInit {

  constructor(
    public location:Location,
    private authService: AuthService,

    private sessionService: SessionService
) { }

  ngOnInit() {

    this.authService.purgeAuth();
    this.sessionService.reset();
  }

}
