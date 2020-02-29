import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Table } from 'primeng/table';

import { AbstractComponent } from '../../abstract.component';
import { TemplateMapping } from '../../domain/template-mapping';
import { TemplateService } from '../../service/template.service';


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
  submitted = false;
  mappings: TemplateMapping[];
  cols: any[];
  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

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

  get f() { return this.addTemplateNameForm.controls; }

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
    const templateDto = {id: this.template.value, name: this.template.label, mappings: [...this.mappings]};
    this.templateService.updateTemplate(templateDto).subscribe(newDto => {
        this.mappings = newDto.mappings;
    });
  }

  showDialogToAdd() {
    this.submitted = false;
    this.displayDialog = true;
    this.addTemplateNameForm.setValue({'templateName':''});
  }

  saveNewTemplate() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addTemplateNameForm.invalid) {
        return;
    }

    const templateDto = {id: undefined, name: this.addTemplateNameForm.value.templateName, mappings: []};

    this.templateService.getTemplate('1').then(result => {
      templateDto.mappings = result.mappings;
      this.templateService.addTemplate(templateDto).subscribe(newDto => {
        this.templateService.getTemplates().then(templates => {
          this.template = {value: newDto.id, label: newDto.name};
          this.templates = [];
          templates.forEach(el => {
            this.templates.push({...el});
          });
          if (this.templates.length > 0) {
            this.mappings = newDto.mappings;
            this.displayDialog = false;
            setTimeout(() => (this.template = {value: newDto.id, label: newDto.name}), 500);
          }
        });
      });
    });
    this.displayDialog = false;
  }

  delete() {
    const index = this.template.value;
    if (index === '1' || index === '2') {
      alert(this.translate.instant('It\'s not allowed to delete default import or export template.'));
    }
    if (index !== undefined ) {
      this.templateService.deleteTemplate(index).subscribe(ua => {
        this.loadTemplates();

      });
    }
    this.displayDialog = false;
  }
}
