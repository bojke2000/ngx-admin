import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogModule } from 'primeng/dialog';

import { ThemeModule } from '../@theme/theme.module';
import { AccountManagementModule } from './account-management/account-management.module';
import { ImportExportModule } from './import-export/import-export.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
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
