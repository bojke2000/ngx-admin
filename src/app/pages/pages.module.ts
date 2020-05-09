import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AccountManagementModule } from './account-management/account-management.module';
import { AlarmModule } from './alarm/alarm.module';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { ImportExportModule } from './import-export/import-export.module';
import { NbMenuModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserCardModule } from './user-card/user-card.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    UserCardModule,
    DialogModule,
    AccountManagementModule,
    AlarmModule,
    ImportExportModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
