import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { LogfileComponent } from './logfile.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ThemeModule } from '../../@theme/theme.module';
import { ToolboxComponentsModule } from '../../libs/toolbox-components/toolbox-components.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToolboxComponentsModule,
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
    LogfileComponent,
  ],
})
export class LogfileModule { }
