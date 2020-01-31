import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { UserAccountComponent } from './user-account.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    ButtonModule,
    ThemeModule,
    TableModule,
    FormsModule,
    DialogModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    UserAccountComponent,
  ],
})
export class AccountManagementModule { }
