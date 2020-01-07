import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import {TableModule} from 'primeng/table';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    TableModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
