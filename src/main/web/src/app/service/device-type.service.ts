import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractService } from "../abstract.service";
import { Option } from "../domain/option";

@Injectable()
export class DeviceTypeService extends AbstractService {
  private url = this.prefix + "device-types";

  constructor(http: HttpClient) {
    super(http);
  }

  public getDeviceTypesAsOptions() {
    let url = `${this.url}/options`;

    return this.http
      .get<any>(url)
      .toPromise()
      .then((res) => <Option[]>res.data)
      .then((data) => data);
  }
}
