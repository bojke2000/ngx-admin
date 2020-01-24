import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    ButtonModule,
    ThemeModule,
    TableModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
