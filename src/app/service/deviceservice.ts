import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Device } from '../domain/device';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) { }

    getDevices() {
    return this.http.get<any>('http://localhost:8081/devices')
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
    }
}
