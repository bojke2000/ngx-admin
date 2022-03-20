import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractService } from "../abstract.service";
import { LoraConfig } from "../domain/lora-config";
import { Pageable } from "../domain/pageable";


@Injectable()
export class LoraConfigService extends AbstractService {
  
  private url = this.prefix + "lora-configs";

  constructor(http: HttpClient) {
    super(http);
  }

  restartLoraConnection() {
    return super.get(this.url + '/reconnect');;
  }

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable) {
    return super.get(this.url, pageable);
  }

  updateLoraConfig(loraConfig: LoraConfig) {
    return super.put(this.url, loraConfig);
  }

  deleteLoraConfig(loraConfig: LoraConfig) {
    return super.delete(this.url, `${loraConfig.id}`);
  }
}
