import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MailAccountComponent } from './account-management/mail-account.component';
import { UserAccountComponent } from './account-management/user-account.component';
import { CityComponent } from './city/city.component';
import { DeviceComponent } from './device/device.component';
import { ImportUserCardComponent } from './import-export/import-user-card.component';
import { TemplateComponent } from './import-export/template.component';
import { PagesComponent } from './pages.component';
import { RouteComponent } from './route/route.component';
import { UserCardComponent } from './user-card/user-card.component';
import { WmbusDeviceComponent } from './wmbus-device/wmbus-device.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'user-card',
      component: UserCardComponent,
    },
    {
      path: 'user-account',
      component: UserAccountComponent,
    },
    {
      path: 'mail-account',
      component: MailAccountComponent,
    },
    {
      path: 'template',
      component: TemplateComponent,
    },
    {
      path: 'import-user-card',
      component: ImportUserCardComponent,
    },
    {
      path: 'device',
      component: DeviceComponent,
    },
    {
      path: 'wmbus-device',
      component: WmbusDeviceComponent,
    },
    {
      path: 'city',
      component: CityComponent,
    },
    {
      path: 'route',
      component: RouteComponent,
    },
    {
      path: '',
      redirectTo: 'user-card',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
