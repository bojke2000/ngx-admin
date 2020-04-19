import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { UserCardColumnDto } from '../domain/user-card-column';

@Injectable()
export class UserCardColumnService extends AbstractService {

  private url = this.prefix + 'card-columns';

  constructor(http: HttpClient) {
    super(http);
  }

  findAllOptions(gridId: number) {
    const url = `${this.url}/options/${gridId}`;
    return this.http.get<any>(url, this.httpOptions)
      .toPromise()
      .then(res => <Option[]>res);
  }

  findAll(gridId: number) {
    const url = `${this.url}/${gridId}`;
    return this.http.get<any>(url, this.httpOptions)
      .toPromise()
      .then(res => <UserCardColumnDto[]>res);
  }
}
