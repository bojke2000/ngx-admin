import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExportUserCardService extends AbstractService {
  private url = this.prefix + 'export-user-card';

  constructor(http: HttpClient) { super(http);  }

  downloadUserCard(request: any) {
    let url = `${this.url}`;
    const getUrl = url.concat('?').concat(this.jsonToHttpParams(request));
    return this.download(getUrl);
   }
}
