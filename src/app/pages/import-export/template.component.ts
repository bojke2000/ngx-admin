import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { TemplateMapping } from '../../domain/template-mapping';
import { TemplateService } from '../../service/template.service';
import { Option } from '../../domain/option';
import { ChangeDetectorRef } from '@angular/core';
import { TemplateDto } from '../../domain/template-dto';
import { Reference } from '../../domain/reference';


@Component({
  selector: 'ie-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent extends AbstractComponent implements OnInit, AfterViewInit {
  templates: Option[];
  template: Option;

  mappings: TemplateMapping[];
  cols: any[];

  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
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

    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
      if (this.templates.length > 0) {
        this.template = templates[0];
        this.templateService.getTemplate(this.template.value).then(result => this.mappings = result.data);
      }
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onTemplateChange() {
    this.templateService.getTemplate(this.template.value).then(ngresp => {
        this.mappings = ngresp.data;
    });
  }

  save() {
    const templateDto = {id: this.template.value, label: this.template.label, mappings: [...this.mappings]} as TemplateDto;
    this.templateService.updateTemplate(templateDto);
  }

  delete() {}

}
