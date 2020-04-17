import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { ThemeModule } from '../../@theme/theme.module';
import { ToolboxComponentsModule } from '../../libs/toolbox-components/toolbox-components.module';
import { DeviceComponent } from './device.component';

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
    DeviceComponent,
  ],
})
export class DeviceModule { }
