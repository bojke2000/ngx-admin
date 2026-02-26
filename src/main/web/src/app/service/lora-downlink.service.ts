import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from '../abstract.service';
import { LoraDownLinkFPort50Response } from '../domain/lora-downlink-fport50-response.dto';
import { LoraFPort50 } from '../domain/lora-fport50';
import { LoraFPort67 } from '../domain/lora-fport67';

@Injectable()
export class LoraDownlinkService extends AbstractService {

  private url = this.prefix + 'lora-downlink';

  constructor(http: HttpClient) { super(http); }

  sendLoradownlinkFPort50Message(loraDownlinkMessage: LoraFPort50): Observable<LoraDownLinkFPort50Response> {
    return this.post(this.url, loraDownlinkMessage);
  }

  sendLoradownlinkFPort67Message(loraDownlinkMessage: LoraFPort67): Observable<LoraDownLinkFPort50Response> {
    return this.post(`${this.url}/port67`, loraDownlinkMessage);
  }
}
