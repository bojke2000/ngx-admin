import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Device } from '../domain/device';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) { }

    getDevices() {
    return this.http.get<any>('http://localhost:8081/device')
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
    }

    getCarsMedium() {
    return this.http.get<any>('assets/showcase/data/cars-medium.json')
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
    }

    getCarsLarge() {
    return this.http.get<any>('assets/showcase/data/cars-large.json')
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
    }

  getCarsHuge() {
    return this.http.get<any>('assets/showcase/data/cars-huge.json')
      .toPromise()
      .then(res => <Device[]>res.data)
      .then(data => data);
  }
}
