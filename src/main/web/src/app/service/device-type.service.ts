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

  public async getDeviceTypesAsOptions() {
    let url = `${this.url}/options`;

    const res = await this.http
      .get<any>(url)
      .toPromise();
    const data = <Option[]>res.data;
    return data;
  }
}
