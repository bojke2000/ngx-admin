import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';

import { AbstractComponent } from '../../AbstractComponent';
import { TemplateMapping } from '../../domain/template-mapping';
import { TemplateService } from '../../service/template.service';
import { CityService } from '../../service/city.service';

@Component({
  selector: 'ie-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  displayDialog = false;
  displayMessage = false;
  submitted = false;
  addTemplateNameForm: FormGroup;
  templates: SelectItem[];
  template: SelectItem;
  cities: SelectItem[];
  mappings: TemplateMapping[];
  cols: any[];
  private subs: Subscription = new Subscription();
  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private formBuilder: FormBuilder,
    private cityService: CityService,
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

    this.addTemplateNameForm = this.formBuilder.group({
      cityId: [undefined, [Validators.required]],
    });

    this.loadTemplates();

    this.cityService.getCities().then(cities => {
      this.cities = cities;
      this.addTemplateNameForm.patchValue({cityId: this.cities[0].value});
    });

  }

  ngAfterViewInit() {
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
  }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (!(this.cdr as ViewRef).destroyed) {
      this.cdr.detectChanges();
    }
  }

  loadTemplates() {
    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
      if (this.templates.length > 0) {
        this.template = templates[0];
        this.addTemplateNameForm.patchValue({...templates[0]});
        this.templateService.getTemplate(this.template.value).then(result => this.mappings = result.mappings);
      }
    });
  }

  onTemplateChange(event) {
    this.templateService.getTemplate(this.template.value).then(dto => {
      this.mappings = dto.mappings;
    });
  }

  save() {
    const templateDto = {
      id: this.template.value,
      cityId: undefined,
      name: this.template.label,
      mappings: [...this.mappings] };

    const sub = this.templateService.updateTemplate(templateDto).subscribe(newDto => {
      this.mappings = newDto.mappings;
    });

    this.subs.add(sub);
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

    const templateDto = {
      id: undefined,
      cityId: this.addTemplateNameForm.value.cityId,
      name: undefined,
      mappings: [] };

    this.templateService.getTemplate('1').then(result => {
      templateDto.mappings = result.mappings;
      const sub = this.templateService.addTemplate(templateDto).subscribe(newDto => {
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
      this.subs.add(sub);
    });

    this.displayDialog = false;
  }

  delete() {
    const index = this.template.value;
    if (index === '1' || index === '2' || index === '3') {
      this.displayMessage = true;
    }
    if (index !== undefined) {
      const sub = this.templateService.deleteTemplate(index).subscribe(ua => {
      this.loadTemplates();
      });
      this.subs.add(sub);
    }
    this.displayDialog = false;
    this.cdr.detectChanges();
  }

  closeMessageDialog() {
    this.displayMessage = false;
  }
}
