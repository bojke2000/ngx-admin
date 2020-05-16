import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AbstractComponent } from '../../AbstractComponent';
import { ExportAdoService } from './../../service/export-ado.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'ngx-export-ado',
  templateUrl: './export-ado.component.html',
  providers: [MessageService],
})
export class ExportAdoComponent extends AbstractComponent implements OnInit, OnDestroy {

  adoForm1: FormGroup;
  adoForm2: FormGroup;
  loading = false;
  submitted = false;
  private subscription: Subscription;

  constructor(
    translate: TranslateService,
    private exportAdoService: ExportAdoService,
    private fb: FormBuilder) {
    super(translate);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get f() { return this.adoForm1.controls; }

  ngOnInit() {
    this.adoForm1 = this.fb.group({ pageSize: [0, Validators.required]});
    this.adoForm2 = this.fb.group({});
  }

  onAdoForm1Submit() {
    this.adoForm1.markAsDirty();
  }

  onAdoForm2Submit() {
    this.adoForm2.markAsDirty();
  }

  onExport(): void {
   this.subscription = this.exportAdoService.ado(this.adoForm1.controls['pageSize'].value).subscribe(
      (data: any) => {
        this.downloadFile(data);
      });
  }

  downloadFile(data: any) {
    importedSaveAs(new Blob([data], { type: 'application/zip' }), 'ADO.zip');
  }
}
