import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PanelModule,
    ChartModule,
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: [DecimalPipe],
})
export class DashboardModule {}
