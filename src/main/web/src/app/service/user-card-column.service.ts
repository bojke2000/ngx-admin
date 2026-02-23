import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { UserCardColumnDto } from '../domain/user-card-column';

@Injectable()
export class UserCardColumnService extends AbstractService {

  private url = this.prefix + 'card-columns';
  private columnsCache = new Map<number, UserCardColumnDto[]>();
  private columnsPromiseCache = new Map<number, Promise<UserCardColumnDto[]>>();

  constructor(http: HttpClient) {
    super(http);
  }

  findAllOptions(gridId: number) {
    const url = `${this.url}/options/${gridId}`;
    return this.http.get<any>(url, this.httpOptions)
      .toPromise()
      .then(res => <Option[]>res);
  }

  async findAll(gridId: number) {
    const cached = this.columnsCache.get(gridId);
    if (cached) {
      return cached;
    }
    const pending = this.columnsPromiseCache.get(gridId);
    if (pending) {
      return pending;
    }

    const url = `${this.url}/${gridId}`;
    const request = this.http.get<any>(url, this.httpOptions)
      .toPromise()
      .then(res => <UserCardColumnDto[]>res);

    const trackedRequest = request.then((data) => {
      this.columnsCache.set(gridId, data || []);
      this.columnsPromiseCache.delete(gridId);
      return this.columnsCache.get(gridId) as UserCardColumnDto[];
    }).catch((err) => {
      this.columnsPromiseCache.delete(gridId);
      throw err;
    });

    this.columnsPromiseCache.set(gridId, trackedRequest);
    return trackedRequest;
  }
}
