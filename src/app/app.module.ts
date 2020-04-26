import { MunicipalityService } from './service/municipailty.service';
import { ReadingBookService } from './service/reading-book.service';
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import {
  NbButtonModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';
import { NbAuthJWTInterceptor } from './jwt-interceptor';
import { metaReducers, reducers } from './reducers';
import { CityService } from './service/city.service';
import { ImportUserCardService } from './service/import-user-card.service';
import { MailAccountService } from './service/mail-account.service';
import { RoleService } from './service/role.service';
import { TemplateService } from './service/template.service';
import { UserAccountService } from './service/user-account.service';
import { UserCardColumnService } from './service/user-card-column.service';
import { UserCardService } from './service/user-card.service';
import { UserAccountTypesService } from './service/useraccounttypes.service';
import { RouteService } from './service/route.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbButtonModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    NbAuthModule.forRoot({
      strategies: [

        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: 'http://localhost:8081/',
          requestPass: false,
          logout: {
            endpoint: 'auth/logout',
            method: 'post',
            requireValidToken: true,
            redirect: {
              success: '/',
              failure: '/',
            },
          },
          resetPass: {
            endpoint: 'auth/reset',
            redirect: {
              success: '/',
              failure: '/auth/login',
            },
          },
          refreshToken: {
            endpoint: 'auth/refresh',
            method: 'post',
          },
          login: {
            endpoint: 'auth/login',
            method: 'post',
            redirect: {
              success: '/pages',
            },
            requireValidToken: true,
          },
          token: {
            class: NbAuthJWTToken,
            key: 'jwt',
          },
        }),
      ],


      forms: {},
    }),
  ],
  providers: [AuthGuard, UserCardService, UserAccountService, MailAccountService, RouteService,
    ReadingBookService, MunicipalityService, UserAccountTypesService, CityService, RoleService, TemplateService, ImportUserCardService,
    UserCardColumnService, { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true},
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: () => false}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
