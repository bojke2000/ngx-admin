import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AbstractComponent } from '../../AbstractComponent';
import { ImportUserCardService } from '../../service/import-user-card.service';


@Component({
  selector: 'ngx-import-ado-card',
  templateUrl: './import-ado.component.html',
  providers: [MessageService],
})
export class ImportAdoComponent extends AbstractComponent implements OnInit {

  secondForm: FormGroup;
  uploadedFiles: any[] = [];
  loading = false;
  fileName?: string = undefined;

  constructor(
    translate: TranslateService,
    private router: Router,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder) {
    super(translate);
  }

  ngOnInit() {
    this.secondForm = this.fb.group({ uploadFlag: [undefined, Validators.requiredTrue]});
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onFileUpload(data: { files: File }): void {
    this.loading = true;
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    this.fileName = file.name;
    this.importUserCardService.importAdo(formData).then(status => {
      this.loading = false;
      this.router.navigate([`/pages/user-card`]);
    });
  }
}
