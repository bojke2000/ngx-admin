import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { ReadingBook } from '../domain/reading-book';
import { Pageable } from '../domain/pageable';

@Injectable()
export class ReadingBookService extends AbstractService {

  private url = this.prefix + 'reading-books';

  constructor(http: HttpClient) {
    super(http);
  }

  async getReadingBooksAsOptions(query?: string) {
    let url = `${this.url}/options`;
    if (query !== undefined) {
      url += '?query=' + query;
    }
    const res = await this.http.get<any>(url)
      .toPromise();
    const data = <Option[]>res.data;
    return data;
  }

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable) {
    return super.get(this.url, pageable);
  }

  createReadingBook(readingBook: ReadingBook) {
    return super.post(this.url, readingBook);
  }

  updateReadingBook(readingBook: ReadingBook) {
    return super.put(this.url, readingBook);
  }

  deleteReadingBook(readingBook: ReadingBook) {
    return super.delete(this.url, `${readingBook.id}`);
  }

  upload(formData: FormData) {
    return super._upload(this.url, formData);
  }
}
