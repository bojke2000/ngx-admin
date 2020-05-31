import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';

import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { TitleHeaderComponent } from './title-header/title-header.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
    }),
  ],
  exports: [TitleHeaderComponent, NgxTableComponent],
  declarations: [TitleHeaderComponent, NgxTableComponent],
})
export class ToolboxComponentsModule { }
