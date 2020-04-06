import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option } from '../domain/option';
import { AbstractService } from '../abstract.service';

@Injectable()
export class CityService extends AbstractService {

  private url = this.prefix + 'cities';

  constructor(http: HttpClient) {
    super(http);
  }

  getCities(query?: string) {
    if (query !== undefined) {
      this.url += 'query=' + query;
    }
    return this.http.get<any>(this.url)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
  }
}
