import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { ImportUserCardRespDto } from '../domain/import-user-card-resp.dto';

@Injectable()
export class ImportUserCardService extends AbstractService {

  private url = this.prefix + 'import-user-card';

  constructor(http: HttpClient) { super(http);  }

  upload(formData: FormData) {
   return  super._upload(this.url, formData);
  }

  import(importUserCardRespDto: ImportUserCardRespDto) {
    return this.http.post<any>(this.url + '/import', importUserCardRespDto, this.httpOptions)
      .toPromise();
  }
}
