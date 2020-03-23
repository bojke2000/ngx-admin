import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';

@Injectable()
export class CardColumnService extends AbstractService {

  private url = this.prefix + 'card-columns';

  constructor(private http: HttpClient) {
    super();
  }

  getCardColumns() {
    return this.http.get<any>(this.url, this.httpOptions)
      .toPromise()
      .then(res => <Option[]>res);
  }
}
