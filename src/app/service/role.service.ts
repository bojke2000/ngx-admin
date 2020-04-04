import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';

@Injectable()
export class RoleService extends AbstractService {

  private url = this.prefix + 'roles';

  constructor(private http: HttpClient) {
    super();
  }

  getRoles() {
    return this.http.get<any>(this.url)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
  }
}
