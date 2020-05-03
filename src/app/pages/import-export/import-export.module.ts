import { ImportAdoComponent } from './import-ado.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbSpinnerModule, NbStepperModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { ThemeModule } from '../../@theme/theme.module';
import { ToolboxComponentsModule } from '../../libs/toolbox-components/toolbox-components.module';
import { ImportMapperComponent } from './import-mapper.component';
import { ImportUserCardComponent } from './import-user-card.component';
import { TemplateComponent } from './template.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    NbStepperModule,
    NbSpinnerModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    PanelModule,
    ThemeModule,
    TableModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    FileUploadModule,
    HttpClientModule,
    ReactiveFormsModule,
    DialogModule,
    ToolboxComponentsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    TemplateComponent,
    ImportMapperComponent,
    ImportUserCardComponent,
    ImportAdoComponent,
  ],
})
export class ImportExportModule { }
