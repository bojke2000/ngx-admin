import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import { HttpClientModule } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { UserAccountComponent } from './user-account.component';
import { MailAccountComponent } from './mail-account.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MatInputModule} from '@angular/material/input';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    PanelModule,
    ThemeModule,
    TableModule,
    MessageModule,
    MessagesModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    MailAccountComponent,
  ],
})
export class AccountManagementModule { }
