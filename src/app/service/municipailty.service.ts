import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { Municipality } from '../domain/municipality';
import { Pageable } from '../domain/pageable';

@Injectable()
export class MunicipalityService extends AbstractService {

  private url = this.prefix + 'municipalities';

  constructor(http: HttpClient) {
    super(http);
  }

  getMunicipalitiesAsOptions(query?: string) {
    let url = `${this.url}/options`;
    if (query !== undefined) {
      url += '?query=' + query;
    }
    return this.http.get<any>(url)
      .toPromise()
      .then(res => <Option[]>res.data)
      .then(data => data);
  }

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable) {
    return super.get(this.url, pageable);
  }

  createMunicipality(Municipality: Municipality) {
    return super.post(this.url, Municipality);
  }

  updateMunicipality(Municipality: Municipality) {
    return super.put(this.url, Municipality);
  }

  deleteMunicipality(Municipality: Municipality) {
    return super.delete(this.url, `${Municipality.id}`);
  }

  upload(formData: FormData) {
    return super._upload(this.url, formData);
  }
}
