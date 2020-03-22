import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { ImportSample } from '../domain/import-sample';

@Injectable()
export class ImportUserCardService extends AbstractService {

  private url = this.prefix + 'import-user-card';

  constructor(private http: HttpClient) { super(); }

  upload(formData: FormData) {
    const myHttpOptions = { headers: new HttpHeaders({})};

    return this.http.post<any>(this.url + '/upload', formData, myHttpOptions)
      .toPromise()
      .then(data => data);
  }

  import(formData: any) {
    return this.http.post<any>(this.url + '/import', formData, this.httpOptions)
      .toPromise()
      .then(data => <ImportSample>data);
  }

  loadImport() {
    return this.http.get<any>('assets/showcase/data/cars-small.json')
        .toPromise()
        .then(res => <any[]> res.data)
        .then(data => data);
}
}
