import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AbstractComponent } from '../../AbstractComponent';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-export-ado',
  templateUrl: './export-ado.component.html',
  providers: [MessageService],
})
export class ExportAdoComponent extends AbstractComponent {

  adoForm1: FormGroup;
  adoForm2: FormGroup;

  constructor(
    translate: TranslateService,
    private fb: FormBuilder) {
    super(translate);
  }

  ngOnInit() {
    this.adoForm1 = this.fb.group({ adoSize: [undefined, Validators.requiredTrue]});
  }

  onAdoForm1Submit() {
    this.adoForm1.markAsDirty();
  }

  onAdoForm2Submit() {
    this.adoForm2.markAsDirty();
  }

  onExport(): void {

  }
}
