import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { UserCardComponent } from './user-card/user-card.component';
import { UserAccountComponent } from './account-management/user-account.component';
import { MailAccountComponent } from './account-management/mail-account.component';
import { TemplateComponent } from './import-export/template.component';

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
