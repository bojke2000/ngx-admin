import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';

@Injectable()
export class ImageService extends AbstractService {
  private url = this.prefix + 'images';

  constructor(http: HttpClient) {
    super(http);
  }

  getURL(customerId: number) {
    return `${this.url}/${customerId}?rand=${new Date().getTime()}`;
  }
}
