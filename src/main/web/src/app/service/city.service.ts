import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { City } from '../domain/city';
import { Option } from '../domain/option';
import { Pageable } from '../domain/pageable';

@Injectable()
export class CityService extends AbstractService {

  private url = this.prefix + 'cities';

  constructor(http: HttpClient) {
    super(http);
  }

  getCitiesAsOptions(query?: string) {
    let url = `${this.url}/options`;
    if (query !== undefined) {
      url = `${url}?query='${query}`;
    }
    return this.http.get<any>(url)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
  }

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable) {
    return super.get(this.url, pageable);
  }

  createCity(city: City) {
    return super.post(this.url, city);
  }

  updateCity(city: City) {
    return super.put(this.url, city);
  }

  deleteCity(city: City) {
    return super.delete(this.url, `${city.id}`);
  }
}
