import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AbstractComponent } from '../../AbstractComponent';
import { CityService } from '../../service/city.service';
import { Grid } from '../../domain/grid';
import { ImportUserCardService } from '../../service/import-user-card.service';
import {
  ImportExecutionRequestDto,
  ImportFieldDefaultDto,
  ImportMappingItemDto,
  ImportPreviewResponseDto,
  ImportProfileDto,
  ImportTargetFieldDto,
  ImportValidationResultDto,
} from '../../domain/import-user-card-v2';

interface MappingRowVm {
  sourceIndex: number;
  sourceKey: string;
  sourceLabel: string;
  sampleValue: string;
  targetField?: string;
}

interface RequiredMappingStatusVm {
  field: string;
  label: string;
  mappedSourceLabel?: string;
}

interface DefaultFieldVm {
  field: string;
  label: string;
  description: string;
  controlType: string;
  valueType: string;
  options: SelectItem[];
  value?: string;
}

interface DefaultFieldStatusVm {
  field: string;
  label: string;
  value?: string;
  satisfied: boolean;
}

@Component({
  selector: 'ngx-import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit {
  private readonly requiredMappingFields = ['customerId', 'deviceId'];
  fileTypes: SelectItem[] = [];
  deviceTypes: SelectItem[] = [];
  cities: SelectItem[] = [];
  profiles: SelectItem[] = [];

  setupForm: FormGroup;
  uploadForm: FormGroup;
  mappingForm: FormGroup;
  defaultsForm: FormGroup;
  reviewForm: FormGroup;

  loading = false;
  uploadedFileName?: string;
  preview?: ImportPreviewResponseDto;
  validationResult?: ImportValidationResultDto;

  mappingRows: MappingRowVm[] = [];
  defaultFields: DefaultFieldVm[] = [];
  sourceColumnOptions: SelectItem[] = [];
  targetFieldOptions: SelectItem[] = [];
  activeProfile?: ImportProfileDto;
  mode: 'import' | 'template' = 'import';

  constructor(
    translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private cityService: CityService,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder,
  ) {
    super(translate);
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] === 'template' ? 'template' : 'import';
    this.setupForm = this.fb.group({
      city: [undefined, [Validators.required]],
      deviceType: [Grid.USER_CARD, [Validators.required]],
      fileType: ['SEMI-COL', [Validators.required]],
      profileId: [undefined, this.isTemplateMode ? [] : [Validators.required]],
      profileName: [''],
      skipHeader: [false],
      ignoreMissingDeviceId: [true],
    });
    this.uploadForm = this.fb.group({ uploadFlag: [false, Validators.requiredTrue] });
    this.mappingForm = this.fb.group({ ready: [true] });
    this.defaultsForm = this.fb.group({ ready: [true] });
    this.reviewForm = this.fb.group({ ready: [true] });

    this.fileTypes = [
      { label: this.translate.instant('XML'), value: 'XML' },
      { label: this.translate.instant('CSV'), value: 'CSV' },
      { label: this.translate.instant('TAB'), value: 'TXT' },
      { label: this.translate.instant('SEMI-COL'), value: 'SEMI-COL' },
      { label: this.translate.instant('DBF'), value: 'DBF' },
    ];

    this.deviceTypes = [
      { label: this.translate.instant('User Card'), value: Grid.USER_CARD },
    ];

    this.cityService.getCitiesAsOptions().then(cities => {
      this.cities = cities || [];
      if (this.cities.length > 0) {
        this.setupForm.patchValue({ city: this.cities[0].value });
      }
    });

    this.importUserCardService.getProfiles().then(profiles => {
      this.profiles = [{ label: this.translate.instant('No saved profile'), value: undefined }]
        .concat((profiles || []).map(profile => ({
          label: profile.name,
          value: profile.id,
        })));
    });
  }

  get hasPreview(): boolean {
    return !!this.preview;
  }

  get canValidate(): boolean {
    return this.hasPreview
      && this.requiredMappingFields.every(field => this.hasMappingForField(field))
      && (!this.isTemplateMode ? !!this.setupForm.value.profileId : true);
  }

  get missingRequiredMappings(): ImportTargetFieldDto[] {
    if (!this.preview) {
      return [];
    }
    return (this.preview.targetFields || [])
      .filter(field => this.requiredMappingFields.includes(field.field))
      .filter(field => !this.hasMappingForField(field.field));
  }

  get requiredMappingStatuses(): RequiredMappingStatusVm[] {
    if (!this.preview) {
      return [];
    }

    return this.requiredMappingFields.map(requiredField => {
      const targetField = this.preview?.targetFields.find(field => field.field === requiredField);
      const mappedRow = this.mappingRows.find(row => row.targetField === requiredField);
      return {
        field: requiredField,
        label: targetField?.label || requiredField,
        mappedSourceLabel: mappedRow?.sourceLabel,
      };
    });
  }

  get hasMissingDefaultsStep(): boolean {
    return this.defaultFields.length > 0;
  }

  get missingRequiredFields(): ImportTargetFieldDto[] {
    return this.getMissingRequiredFields();
  }

  get canProceedFromDefaults(): boolean {
    return this.defaultFieldStatuses.every(field => field.satisfied);
  }

  get defaultFieldStatuses(): DefaultFieldStatusVm[] {
    return this.defaultFields.map(field => ({
      field: field.field,
      label: field.label,
      value: this.normalizeFieldValue(field.value),
      satisfied: this.hasMappingForField(field.field) || !!this.normalizeFieldValue(field.value),
    }));
  }

  get canExecute(): boolean {
    return !!this.validationResult && this.validationResult.valid;
  }

  get isTemplateMode(): boolean {
    return this.mode === 'template';
  }

  get pageTitle(): string {
    return this.isTemplateMode ? 'Import Template' : 'Import';
  }

  get canUploadSourceFile(): boolean {
    return this.isTemplateMode || !!this.setupForm.value.profileId;
  }

  get profileModeLabel(): string {
    return this.activeProfile ? 'Loaded profile will be updated on import.' : 'Current mapping will be saved on import.';
  }

  async onFileUpload(event: any): Promise<void> {
    const file = event.files && event.files.length ? event.files[0] : undefined;
    if (!file) {
      return;
    }

    this.loading = true;
    this.validationResult = undefined;
    this.preview = undefined;
    this.mappingRows = [];
    this.defaultFields = [];
    this.targetFieldOptions = [];

    try {
      const formData = new FormData();
      formData.append('importFile', file, file.name);
      this.uploadedFileName = file.name;

      const preview = await this.importUserCardService.preview(
        formData,
        this.setupForm.value.fileType,
        undefined,
        !!this.setupForm.value.skipHeader,
        this.setupForm.value.city,
      );
      this.preview = preview;
      this.targetFieldOptions = (preview.targetFields || []).map(field => ({
        label: this.requiredMappingFields.includes(field.field) ? `${field.label} *` : field.label,
        value: field.field,
      }));
      this.mappingRows = this.buildMappingRows(preview);
      this.defaultFields = this.buildDefaultFields(preview.targetFields);
      this.sourceColumnOptions = this.mappingRows.map(row => ({
        label: row.sourceLabel,
        value: row.sourceIndex,
      }));

      await this.applySelectedProfile();
      this.uploadForm.patchValue({ uploadFlag: true });
    } finally {
      this.loading = false;
    }
  }

  async onProfileChange(): Promise<void> {
    if (!this.preview) {
      return;
    }
    await this.applySelectedProfile();
  }

  async onValidate(): Promise<void> {
    if (!this.preview) {
      return;
    }

    this.loading = true;
    try {
      this.validationResult = await this.importUserCardService.validate(this.buildExecutionRequest());
      this.syncRequiredDefaultsFromValidation();
    } catch (error) {
      this.validationResult = error && error.error ? error.error : undefined;
      this.syncRequiredDefaultsFromValidation();
    } finally {
      this.loading = false;
    }
  }

  async onImport(): Promise<void> {
    if (!this.preview) {
      return;
    }

    this.loading = true;
    try {
      await this.importUserCardService.execute(this.buildExecutionRequest());
      this.router.navigate(['/pages/device']);
    } finally {
      this.loading = false;
    }
  }

  async onSaveTemplate(): Promise<void> {
    if (!this.preview) {
      return;
    }

    this.loading = true;
    try {
      const profile = await this.importUserCardService.saveProfile(this.buildExecutionRequest());
      this.activeProfile = profile;
      this.setupForm.patchValue({
        profileId: profile.id,
        profileName: profile.name,
      });
      const profiles = await this.importUserCardService.getProfiles();
      this.profiles = [{ label: this.translate.instant('No saved profile'), value: undefined }]
        .concat((profiles || []).map(item => ({
          label: item.name,
          value: item.id,
        })));
    } finally {
      this.loading = false;
    }
  }

  trackBySourceIndex(_: number, row: MappingRowVm): number {
    return row.sourceIndex;
  }

  trackByField(_: number, row: DefaultFieldVm): string {
    return row.field;
  }

  getTargetFieldLabel(field: string): string {
    if (!this.preview) {
      return field;
    }
    const item = this.preview.targetFields.find(target => target.field === field);
    return item ? item.label : field;
  }

  private async applySelectedProfile(): Promise<void> {
    const profileId = this.setupForm.value.profileId;
    if (!profileId) {
      this.activeProfile = undefined;
      this.setupForm.patchValue({ profileName: '' });
      if (!this.isTemplateMode) {
        this.mappingRows = this.mappingRows.map(row => ({ ...row, targetField: undefined }));
        this.defaultFields = this.buildDefaultFields(this.preview?.targetFields || []);
      }
      return;
    }

    const profile = await this.importUserCardService.getProfile(profileId);
    this.activeProfile = profile;
    this.setupForm.patchValue({ profileName: profile.name });

    try {
      const parsed = JSON.parse(profile.mappingJson) as ImportExecutionRequestDto;
      this.applySavedMappings(parsed.mappings || []);
      this.applySavedDefaults(parsed.defaultValues || []);
      if (parsed.skipHeader !== undefined) {
        this.setupForm.patchValue({ skipHeader: parsed.skipHeader });
      }
      if (parsed.ignoreMissingDeviceId !== undefined) {
        this.setupForm.patchValue({ ignoreMissingDeviceId: parsed.ignoreMissingDeviceId });
      }
    } catch {
      // Ignore invalid saved JSON and let the user map manually.
    }
  }

  private buildMappingRows(preview: ImportPreviewResponseDto): MappingRowVm[] {
    const firstSample = preview.sampleRows && preview.sampleRows.length > 0 ? preview.sampleRows[0] : {};
    return (preview.columns || []).map((column, index) => ({
      sourceIndex: index + 1,
      sourceKey: column.field,
      sourceLabel: column.header || column.field,
      sampleValue: firstSample ? firstSample[column.field] : '',
      targetField: undefined,
    }));
  }

  private buildDefaultFields(targetFields: ImportTargetFieldDto[]): DefaultFieldVm[] {
    return (targetFields || [])
      .filter(field => field.required)
      .map(field => ({
        field: field.field,
        label: field.label,
        description: field.description,
        controlType: field.controlType,
        valueType: field.valueType,
        options: (field.options || []).map(option => ({ label: option.label, value: option.value })),
        value: field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined,
      }));
  }

  private applySavedMappings(mappings: ImportMappingItemDto[]): void {
    const mappingBySourceIndex = new Map<number, ImportMappingItemDto>();
    (mappings || []).forEach(mapping => mappingBySourceIndex.set(mapping.sourceIndex, mapping));
    this.mappingRows = this.mappingRows.map(row => ({
      ...row,
      targetField: mappingBySourceIndex.get(row.sourceIndex)?.targetField,
    }));
  }

  private applySavedDefaults(defaultValues: ImportFieldDefaultDto[]): void {
    const valuesByField = new Map<string, string>();
    (defaultValues || []).forEach(item => valuesByField.set(item.targetField, item.value));
    this.defaultFields = this.defaultFields.map(field => ({
      ...field,
      value: valuesByField.get(field.field) || field.value || (field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined),
    }));
  }

  private buildExecutionRequest(): ImportExecutionRequestDto {
    if (!this.preview) {
      throw new Error('Preview is not loaded.');
    }

    return {
      profileId: this.setupForm.value.profileId,
      profileName: this.setupForm.value.profileName,
      storedFileName: this.preview.storedFileName,
      originalFileName: this.preview.originalFileName,
      fileType: this.preview.fileType,
      delimiter: this.preview.delimiter,
      skipHeader: !!this.setupForm.value.skipHeader,
      cityId: this.setupForm.value.city,
      deviceType: this.setupForm.value.deviceType,
      ignoreMissingDeviceId: !!this.setupForm.value.ignoreMissingDeviceId,
      mappings: this.getSelectedMappings(),
      defaultValues: this.getSelectedDefaultValues(),
    };
  }

  getSelectedMappings(): ImportMappingItemDto[] {
    return this.mappingRows
      .filter(row => !!this.normalizeTargetField(row.targetField))
      .map(row => ({
        sourceIndex: row.sourceIndex,
        sourceKey: row.sourceKey,
        targetField: this.normalizeTargetField(row.targetField) as string,
      }));
  }

  private hasMappingForField(field: string): boolean {
    return this.mappingRows.some(row => this.normalizeTargetField(row.targetField) === field);
  }

  private normalizeTargetField(targetField?: string): string | undefined {
    const normalized = (targetField || '').trim();
    return normalized ? normalized : undefined;
  }

  private normalizeFieldValue(value?: string): string | undefined {
    const normalized = (value || '').trim();
    return normalized ? normalized : undefined;
  }

  getSelectedDefaultValues(): ImportFieldDefaultDto[] {
    return this.defaultFields
      .filter(field => !!this.normalizeFieldValue(field.value))
      .map(field => ({
        targetField: field.field,
        value: this.normalizeFieldValue(field.value) as string,
      }));
  }

  private getMissingRequiredFields(): ImportTargetFieldDto[] {
    if (!this.preview) {
      return [];
    }
    const statusesByField = new Map(this.defaultFieldStatuses.map(field => [field.field, field]));
    return (this.preview.targetFields || [])
      .filter(field => field.required)
      .filter(field => !statusesByField.get(field.field)?.satisfied);
  }

  private syncRequiredDefaultsFromValidation(): void {
    const requiredFields = this.validationResult?.requiredUnmappedFields || [];
    if (requiredFields.length === 0) {
      return;
    }

    const currentValues = new Map<string, string>();
    this.defaultFields.forEach(field => currentValues.set(field.field, field.value || ''));
    this.defaultFields = requiredFields.map(field => ({
      field: field.field,
      label: field.label,
      description: field.description,
      controlType: field.controlType,
      valueType: field.valueType,
      options: (field.options || []).map(option => ({ label: option.label, value: option.value })),
      value: currentValues.get(field.field) || (field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined),
    }));
  }
}
