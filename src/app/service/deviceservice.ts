import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Device } from '../domain/device';

@Injectable()
export class DeviceService extends AbstractService {

  private url = this.prefix + 'devices';

  constructor(private http: HttpClient) { super(); }

  getDevices() {
    return this.http.get<any>(this.url, this.httpOptions)
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
  }
}
