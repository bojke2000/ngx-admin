import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { Pageable } from '../domain/pageable';

@Injectable()
export class UserCardService extends AbstractService {

  private url = this.prefix + 'user-cards';

  constructor(http: HttpClient) { super(http); }

  findAll(pageable?: Pageable) {
    return this.get(this.url, pageable);
  }
}
