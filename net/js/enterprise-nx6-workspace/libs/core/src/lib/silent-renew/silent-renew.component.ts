import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/security/security.service';

@Component({
  selector: 'ec-silent-renew',
  templateUrl: './silent-renew.component.html',
  styleUrls: ['./silent-renew.component.css']
})
export class SilentRenewComponent implements OnInit {
  constructor(private securityService: SecurityService) {}

  ngOnInit() {
    this.securityService.SilentRenew();
  }
}
