import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option } from '../domain/option';

@Injectable()
export class CityService {

    constructor(private http: HttpClient) { }

    getCities(query?: string) {
    let url = 'http://localhost:8081/cities';
    if (query !== undefined) {
      url += 'query=' + query;
    }
    return this.http.get<any>(url)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
    }
}
