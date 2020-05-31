import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbToggleModule, NbCheckboxModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import {CardModule} from 'primeng/card';
import {InputSwitchModule} from 'primeng/inputswitch';
import {CheckboxModule} from 'primeng/checkbox';

import { ThemeModule } from '../../@theme/theme.module';
import { ToolboxComponentsModule } from '../../libs/toolbox-components/toolbox-components.module';
import { DeviceComponent } from './device.component';
import {FieldsetModule} from 'primeng/fieldset';
import {InputTextareaModule} from 'primeng/inputtextarea';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    NbCardModule,
    NbToggleModule,
    NbCheckboxModule,
    CardModule,
    FieldsetModule,
    NbButtonModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    DropdownModule,
    AutoCompleteModule,
    InputSwitchModule,
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
    DeviceComponent,
  ],
})
export class DeviceModule { }