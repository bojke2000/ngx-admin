import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { Pageable } from '../domain/pageable';
import { Route } from '../domain/route';

@Injectable()
export class RouteService extends AbstractService {

  private url = this.prefix + 'routes';

  constructor(http: HttpClient) {
    super(http);
  }

  getCitiesAsOptions(query?: string) {
    if (query !== undefined) {
      this.url += '/options?query=' + query;
    }
    return this.http.get<any>(this.url)
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

  createRoute(route: Route) {
    return super.post(this.url, route);
  }

  updateRoute(route: Route) {
    return super.put(this.url, route);
  }

  deleteRoute(route: Route) {
    return super.delete(this.url, `${route.id}`);
  }

  upload(formData: FormData) {
    return super._upload(this.url, formData);
  }
}
