import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MailAccountComponent } from "./account-management/mail-account.component";
import { UserAccountComponent } from "./account-management/user-account.component";
import { AlarmComponent } from "./alarm/alarm.component";
import { CityComponent } from "./city/city.component";
import { DeviceComponent } from "./device/device.component";
import { ExportAdoComponent } from "./import-export/export-ado.component";
import { ExportUserCardComponent } from "./import-export/export-user-card.component";
import { ImportAdoComponent } from "./import-export/import-ado.component";
import { ImportUserCardComponent } from "./import-export/import-user-card.component";
import { TemplateComponent } from "./import-export/template.component";
import { ImportLogComponent } from "./import-log/import-log.component";
import { LogfileComponent } from "./logfile/logfile.component";
import { LoraConfigComponent } from "./lora-config/lora-config.component";
import { PagesComponent } from "./pages.component";
import { RouteComponent } from "./route/route.component";
import { UserCardComponent } from "./user-card/user-card.component";
import { WmbusDeviceComponent } from "./wmbus-device/wmbus-device.component";
import { ZoneDeviceComponent } from "./zone-device/zone-device.component";
import { ZoneDeviceAssignComponent } from "./zone-device-assign/zone-device-assign.component";


const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "user-card",
        component: UserCardComponent,
      },
      {
        path: "import-ado",
        component: ImportAdoComponent,
      },
      {
        path: "user-account",
        component: UserAccountComponent,
      },
      {
        path: "mail-account",
        component: MailAccountComponent,
      },
      {
        path: "template",
        component: TemplateComponent,
      },
      {
        path: "import-user-card",
        component: ImportUserCardComponent,
        data: { mode: "import" },
      },
      {
        path: "user-card-import",
        redirectTo: "import-user-card",
        pathMatch: "full",
      },
      {
        path: "import-template",
        component: ImportUserCardComponent,
        data: { mode: "template" },
      },
      {
        path: "export-user-card",
        component: ExportUserCardComponent,
      },
      {
        path: "export-ado",
        component: ExportAdoComponent,
      },
      {
        path: "device",
        component: DeviceComponent,
      },
      {
        path: "wmbus-device",
        component: WmbusDeviceComponent,
      },
      {
        path: "city",
        component: CityComponent,
      },
      {
        path: "lora-config",
        component: LoraConfigComponent,
      },
      {
        path: "route",
        component: RouteComponent,
      },
      {
        path: "alarm",
        component: AlarmComponent,
      },
      {
        path: "logfile",
        component: LogfileComponent,
      },
      {
        path: "import-log",
        component: ImportLogComponent,
      },
      {
        path: "zone-device",
        component: ZoneDeviceComponent,
      },
      {
        path: "",
        redirectTo: "user-card",
        pathMatch: "full",
      },
      {
        path: "zone-device-assign",
        component: ZoneDeviceAssignComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
