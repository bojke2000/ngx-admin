import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';

@Injectable()
export class ImportUserCardService extends AbstractService {

  private url = this.prefix + 'import-user-card';

  httpOptions = {
    headers: new HttpHeaders({
     // 'Content-Type':  'multipart/form-data',
    }),
  };

  constructor(private http: HttpClient) { super(); }

  importUserCard(formData: FormData) {
    return this.http.post<any>(this.url, formData, this.httpOptions)
      .toPromise()
      .then(data => data);
  }

  loadImport() {
    return this.http.get<any>('assets/showcase/data/cars-small.json')
        .toPromise()
        .then(res => <any[]> res.data)
        .then(data => data);
}
}
