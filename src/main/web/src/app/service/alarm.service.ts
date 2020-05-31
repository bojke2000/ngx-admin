import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable } from '../domain/pageable';

@Injectable()
export class AlarmService extends AbstractService {
  private url = this.prefix + 'alarms';

  constructor(http: HttpClient) {
    super(http);
  }

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable) {
    return super.get(this.url, pageable);
  }

  getCount() {
    return super.get(`${this.url}/error-count`);
  }
}
