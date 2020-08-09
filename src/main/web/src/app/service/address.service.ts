import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { Pageable } from '../domain/pageable';
import { Address } from '../domain/address';


@Injectable()
export class AddressService extends AbstractService {

  private url = this.prefix + 'addresses';

  constructor(http: HttpClient) {
    super(http);
  }

  getAddresssAsOptions(query?: string) {
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

  createAddress(address: Address) {
    return super.post(this.url, address);
  }

  updateAddress(address: Address) {
    return super.put(this.url, address);
  }

  deleteAddress(address: Address) {
    return super.delete(this.url, `${address.id}`);
  }

  upload(formData: FormData) {
    return super._upload(this.url, formData);
  }
}
