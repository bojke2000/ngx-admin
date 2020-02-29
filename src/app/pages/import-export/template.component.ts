import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Table } from 'primeng/table';

import { AbstractComponent } from '../../abstract.component';
import { TemplateMapping } from '../../domain/template-mapping';
import { TemplateService } from '../../service/template.service';
import {ConfirmationService} from 'primeng/api';


@Component({
  selector: 'ie-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent extends AbstractComponent implements OnInit, AfterViewInit {
  addTemplateNameForm: FormGroup;
  templates: SelectItem[];
  template: SelectItem;
  displayDialog: boolean;
  displayMessage: boolean;
  submitted = false;
  mappings: TemplateMapping[];
  cols: any[];
  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  get f() { return this.addTemplateNameForm.controls; }

  ngOnInit(): void {
    this.cols = [
      { field: 'key1', header: 'Field', width: '250px' },
      { field: 'val1', header: 'Mapping', width: '70px' },
      { field: 'key2', header: 'Field', width: '250px' },
      { field: 'val2', header: 'Mapping', width: '70px' },
      { field: 'key3', header: 'Field', width: '250px' },
      { field: 'val3', header: 'Mapping', width: '70px' },
    ];

    this.loadTemplates();

    this.addTemplateNameForm = this.formBuilder.group({
      templateName: ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadTemplates() {
    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
      if (this.templates.length > 0) {
        this.template = templates[0];
        this.templateService.getTemplate(this.template.value).then(result => this.mappings = result.mappings);
      }
    });
  }

  onTemplateChange() {
    this.templateService.getTemplate(this.template.value).then(dto => {
      this.mappings = dto.mappings;
    });
  }

  save() {
    const templateDto = { id: this.template.value, name: this.template.label, mappings: [...this.mappings] };
    this.templateService.updateTemplate(templateDto).subscribe(newDto => {
      this.mappings = newDto.mappings;
    });
  }

  showDialogToAdd() {
    this.submitted = false;
    this.displayDialog = true;
    this.addTemplateNameForm.setValue({ 'templateName': '' });
  }

  saveNewTemplate() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addTemplateNameForm.invalid) {
      return;
    }

    const templateDto = { id: undefined, name: this.addTemplateNameForm.value.templateName, mappings: [] };

    this.templateService.getTemplate('1').then(result => {
      templateDto.mappings = result.mappings;
      this.templateService.addTemplate(templateDto).subscribe(newDto => {
        this.templateService.getTemplates().then(templates => {
          this.templates = [];
          templates.forEach(el => {
            this.templates.push({ ...el });
            if (el.label === this.addTemplateNameForm.value.templateName) {
              this.template = el;
            }
          });
          this.mappings = newDto.mappings;
          this.displayDialog = false;
        });
      });
    });
    this.displayDialog = false;
  }

  delete() {
    const index = this.template.value;
    if (index === '1' || index === '2') {
      this.displayMessage = true;
    }
    if (index !== undefined) {

      this.confirmationService.confirm({
        message: this.translate.instant('Are you sure that you want to perform this action?'),
        accept: () => {
          this.templateService.deleteTemplate(index).subscribe(ua => {
            this.loadTemplates();
          });
        },
      });
    }
    this.displayDialog = false;
  }

  closeMessageDialog() {
    this.displayMessage = false;
  }
}
