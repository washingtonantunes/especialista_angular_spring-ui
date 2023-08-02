import { Component, OnInit } from '@angular/core';

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
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang('pt');
    this.translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }
}
