import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option } from '../domain/option';

@Injectable()
export class CityService {

    constructor(private http: HttpClient) { }

    getCities(event) {
    const query = event.query;
    return this.http.get<any>('http://localhost:8081/cities?query=' + query)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
    }
}
