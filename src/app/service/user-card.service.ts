import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { UserCard } from '../domain/user-card';
import { Pageable } from '../domain/pageable';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';

@Injectable()
export class UserCardService extends AbstractService {

  private url = this.prefix + 'user-cards';

  constructor(http: HttpClient) { super(http); }

  findAll(pageable?: Pageable) {
    return this.get(this.url, pageable);
  }
}
