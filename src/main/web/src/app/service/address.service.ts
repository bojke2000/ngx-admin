import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { Pageable } from '../domain/pageable';
import { Address } from '../domain/address';


@Injectable()
export class AddressService extends AbstractService {

  private url = this.prefix + 'addresses';
  private optionsCache: Option[] | null = null;
  private optionsPromise: Promise<Option[]> | null = null;

  constructor(http: HttpClient) {
    super(http);
  }

  async getAddresssAsOptions(query?: string) {
    if (query === undefined && this.optionsCache) {
      return this.optionsCache;
    }
    if (query === undefined && this.optionsPromise) {
      return this.optionsPromise;
    }

    let url = `${this.url}/options`;
    if (query !== undefined) {
      url += '?query=' + query;
    }

    const request = this.http.get<any>(url)
      .toPromise()
      .then(res => <Option[]>res.data);

    if (query === undefined) {
      this.optionsPromise = request.then(data => {
        this.optionsCache = data || [];
        this.optionsPromise = null;
        return this.optionsCache;
      }).catch((err) => {
        this.optionsPromise = null;
        throw err;
      });
      return this.optionsPromise;
    }

    return request;
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
