import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang('pt');
    this.translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }

  exibindoNavbar() {
    return this.router.url !== '/login';
  }
}
