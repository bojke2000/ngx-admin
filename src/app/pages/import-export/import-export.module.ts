import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NbButtonModule, NbCardModule, NbSpinnerModule, NbStepperModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ExportAdoComponent } from './export-ado.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ImportAdoComponent } from './import-ado.component';
import { ImportMapperComponent } from './import-mapper.component';
import { ImportUserCardComponent } from './import-user-card.component';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TemplateComponent } from './template.component';
import { ThemeModule } from '../../@theme/theme.module';
import { ToastModule } from 'primeng/toast';
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
    ExportAdoComponent,
  ],
})
export class ImportExportModule { }
