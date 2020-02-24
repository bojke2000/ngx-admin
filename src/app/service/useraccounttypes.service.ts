import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';

@Injectable()
export class UserAccountTypesService extends AbstractService {

  private url = this.prefix + 'user-account-types';

  constructor(private http: HttpClient) { super(); }

  getUserAccountTypes() {
    return this.http.get<any>(this.url)
      .toPromise()
      .then(res => <string[]>res.data)
      .then(data => data.map((el) => ({ label: el, value: el }))).then(res => res);
  }
}
