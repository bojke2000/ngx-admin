import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AbstractComponent } from '../../AbstractComponent';
import { CityService } from '../../service/city.service';
import { DeviceTypeService } from '../../service/device-type.service';
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
  targetField?: string;
  sourceIndex?: number;
  sourceKey?: string;
  sourceLabel?: string;
  sampleValue?: string;
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

interface CustomDefaultRowVm {
  field?: string;
  label?: string;
  description?: string;
  controlType: string;
  valueType: string;
  options: SelectItem[];
  value?: string;
}

@Component({
  selector: 'ngx-import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit {
  private readonly maxPreviewRows = 30;
  private readonly requiredMappingFields = ['customerId', 'deviceId'];
  private readonly excludedDefaultFields = ['profileCode'];
  private readonly defaultDeviceType = 0;
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
  customDefaultRows: CustomDefaultRowVm[] = [];
  sourceColumnOptions: SelectItem[] = [];
  targetFieldOptions: SelectItem[] = [];
  activeProfile?: ImportProfileDto;
  mode: 'import' | 'template' = 'import';

  constructor(
    translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private cityService: CityService,
    private deviceTypeService: DeviceTypeService,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder,
  ) {
    super(translate);
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] === 'template' ? 'template' : 'import';
    this.setupForm = this.fb.group({
      city: [undefined, [Validators.required]],
      deviceType: [this.defaultDeviceType, [Validators.required]],
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

    this.loadDeviceTypes();

    this.cityService.getCitiesAsOptions().then(cities => {
      this.cities = cities || [];
      if (this.cities.length > 0) {
        this.setupForm.patchValue({ city: this.cities[0].value });
      }
    });

    this.loadProfiles();
  }

  get hasPreview(): boolean {
    return !!this.preview;
  }

  get canValidate(): boolean {
    return this.hasPreview
      && this.requiredMappingFields.every(field => this.hasMappingForField(field))
      && this.mappingRows.every(row => this.isMappingRowEmpty(row) || this.isMappingRowComplete(row))
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
        label: this.getDisplayLabel(targetField),
        mappedSourceLabel: mappedRow?.sourceLabel,
      };
    });
  }

  get hasMissingDefaultsStep(): boolean {
    return this.isTemplateMode || this.defaultFields.length > 0;
  }

  get missingRequiredFields(): ImportTargetFieldDto[] {
    return this.getMissingRequiredFields();
  }

  get canProceedFromDefaults(): boolean {
    return this.defaultFieldStatuses.every(field => field.satisfied)
      && this.customDefaultRows.every(row => this.isCustomDefaultRowEmpty(row) || this.isCustomDefaultRowComplete(row));
  }

  get defaultFieldStatuses(): DefaultFieldStatusVm[] {
    const statuses = this.defaultFields.map(field => ({
      field: field.field,
      label: field.label,
      value: this.normalizeFieldValue(field.value),
      satisfied: this.hasMappingForField(field.field) || !!this.normalizeFieldValue(field.value),
    }));

    this.customDefaultRows.forEach((row, index) => {
      statuses.push({
        field: row.field || `custom-${index}`,
        label: row.label || this.translate.instant('Additional fixed value'),
        value: this.normalizeFieldValue(row.value),
        satisfied: !!row.field && !!this.normalizeFieldValue(row.value),
      });
    });

    return statuses;
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

  get previewRows(): any[] {
    return this.preview?.sampleRows?.slice(0, this.maxPreviewRows) || [];
  }

  get previewRowCount(): number {
    return this.previewRows.length;
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
    this.customDefaultRows = [];
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
      if (preview?.deviceTypeOptions && preview.deviceTypeOptions.length > 0) {
        this.setDeviceTypes(preview.deviceTypeOptions);
      }
      this.targetFieldOptions = (preview.targetFields || []).map(field => ({
        label: this.requiredMappingFields.includes(field.field) ? `${this.getDisplayLabel(field)} *` : this.getDisplayLabel(field),
        value: field.field,
      }));
      this.mappingRows = [];
      this.defaultFields = this.buildDefaultFields(preview.targetFields);
      this.sourceColumnOptions = (preview.columns || []).map((column, index) => ({
        label: this.buildSourceColumnOptionLabel(column, preview.sampleRows || []),
        value: index + 1,
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

  async refreshProfiles(): Promise<void> {
    await this.loadProfiles();
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
      await this.loadProfiles();
    } finally {
      this.loading = false;
    }
  }

  trackByMappingRow(index: number): string {
    return `mapping-row-${index}`;
  }

  trackByField(_: number, row: DefaultFieldVm): string {
    return row.field;
  }

  trackByCustomDefaultRow(index: number): string {
    return `custom-default-${index}`;
  }

  onDeviceTypeChange(): void {
    // Device type itself is already handled via formControlName and request building.
  }

  addCustomDefaultRow(): void {
    this.customDefaultRows = this.customDefaultRows.concat({
      field: undefined,
      label: undefined,
      description: undefined,
      controlType: 'TEXT',
      valueType: 'string',
      options: [],
      value: undefined,
    });
  }

  removeCustomDefaultRow(index: number): void {
    this.customDefaultRows = this.customDefaultRows.filter((_, rowIndex) => rowIndex !== index);
  }

  addMappingRow(): void {
    this.mappingRows = this.mappingRows.concat({
      targetField: undefined,
      sourceIndex: undefined,
      sourceKey: undefined,
      sourceLabel: undefined,
      sampleValue: undefined,
    });
  }

  removeMappingRow(index: number): void {
    this.mappingRows = this.mappingRows.filter((_, rowIndex) => rowIndex !== index);
  }

  onSourceMappingChange(row: MappingRowVm): void {
    const selectedIndex = Number(row.sourceIndex);
    if (!selectedIndex || !this.preview) {
      row.sourceIndex = undefined;
      row.sourceKey = undefined;
      row.sourceLabel = undefined;
      row.sampleValue = undefined;
      return;
    }

    const column = (this.preview.columns || [])[selectedIndex - 1];
    row.sourceIndex = selectedIndex;
    row.sourceKey = column?.field;
    row.sourceLabel = column?.header || column?.field;
    row.sampleValue = column ? this.getSourceColumnSampleValue(column, this.preview.sampleRows || []) : undefined;
  }

  onCustomDefaultFieldChange(row: CustomDefaultRowVm): void {
    const definition = this.getDefaultFieldDefinition(row.field);
    row.label = definition ? this.getDisplayLabel(definition) : undefined;
    row.description = definition?.description;
    row.controlType = definition?.controlType || 'TEXT';
    row.valueType = definition?.valueType || 'string';
    row.options = (definition?.options || []).map(option => ({ label: option.label, value: option.value }));
    row.value = row.controlType === 'SELECT' ? row.options?.[0]?.value : undefined;
  }

  getTargetFieldLabel(field: string): string {
    if (!this.preview) {
      return field;
    }
    const item = this.preview.targetFields.find(target => target.field === field);
    return item ? this.getDisplayLabel(item) : field;
  }

  private async applySelectedProfile(): Promise<void> {
    const profileId = this.setupForm.value.profileId;
    if (!profileId) {
      this.activeProfile = undefined;
      this.setupForm.patchValue({ profileName: '' });
      if (!this.isTemplateMode) {
        this.mappingRows = [];
        this.defaultFields = this.buildDefaultFields(this.preview?.targetFields || []);
      }
      this.customDefaultRows = [];
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

  private buildDefaultFields(targetFields: ImportTargetFieldDto[]): DefaultFieldVm[] {
    return (targetFields || [])
      .filter(field => field.required)
      .filter(field => !this.excludedDefaultFields.includes(field.field))
      .map(field => ({
        field: field.field,
        label: this.getDisplayLabel(field),
        description: field.description,
        controlType: field.controlType,
        valueType: field.valueType,
        options: (field.options || []).map(option => ({ label: option.label, value: option.value })),
        value: field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined,
      }));
  }

  private applySavedMappings(mappings: ImportMappingItemDto[]): void {
    this.mappingRows = (mappings || []).map(mapping => this.createMappingRow(mapping.targetField, mapping.sourceIndex));
  }

  private applySavedDefaults(defaultValues: ImportFieldDefaultDto[]): void {
    const valuesByField = new Map<string, string>();
    (defaultValues || []).forEach(item => valuesByField.set(item.targetField, item.value));
    this.defaultFields = this.defaultFields.map(field => ({
      ...field,
      value: valuesByField.get(field.field) || field.value || (field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined),
    }));
    const requiredFieldNames = new Set(this.defaultFields.map(field => field.field));
    this.customDefaultRows = (defaultValues || [])
      .filter(item => !!item.targetField)
      .filter(item => !requiredFieldNames.has(item.targetField))
      .map(item => this.createCustomDefaultRow(item.targetField, item.value));
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

  private loadDeviceTypes(): void {
    this.deviceTypeService.getDeviceTypesAsOptions().then(options => {
      this.setDeviceTypes(options || []);
    });
  }

  private async loadProfiles(): Promise<void> {
    const defaultOption = { label: this.translate.instant('No saved profile'), value: undefined };
    this.profiles = [defaultOption];

    try {
      const profiles = await this.importUserCardService.getProfiles();
      this.profiles = [defaultOption].concat((profiles || []).map(profile => ({
        label: profile.name,
        value: profile.id,
      })));
    } catch {
      this.profiles = [defaultOption];
    }
  }

  private setDeviceTypes(options?: Array<{ label: string; value: string }>): void {
    const normalizedOptions = (options || []).map(option => ({
      label: option.label,
      value: parseInt(option.value, 10),
    })).filter(option => !Number.isNaN(option.value));

    this.deviceTypes = normalizedOptions;
    if (!this.deviceTypes.length) {
      return;
    }

    const selectedDeviceType = Number(this.setupForm?.value?.deviceType);
    const matchingOption = this.deviceTypes.find(option => option.value === selectedDeviceType);
    const defaultOption = this.deviceTypes.find(option => option.value === this.defaultDeviceType) || this.deviceTypes[0];
    this.setupForm.patchValue({
      deviceType: matchingOption ? matchingOption.value : defaultOption.value,
    });
  }

  getSelectedMappings(): ImportMappingItemDto[] {
    return this.mappingRows
      .filter(row => this.isMappingRowComplete(row))
      .map(row => ({
        sourceIndex: row.sourceIndex as number,
        sourceKey: row.sourceKey as string,
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

  private isMappingRowEmpty(row: MappingRowVm): boolean {
    return !this.normalizeTargetField(row.targetField) && !row.sourceIndex;
  }

  private isMappingRowComplete(row: MappingRowVm): boolean {
    return !!this.normalizeTargetField(row.targetField) && !!row.sourceIndex;
  }

  private isCustomDefaultRowEmpty(row: CustomDefaultRowVm): boolean {
    return !row.field && !this.normalizeFieldValue(row.value);
  }

  private isCustomDefaultRowComplete(row: CustomDefaultRowVm): boolean {
    return !!row.field && !!this.normalizeFieldValue(row.value);
  }

  getSelectedDefaultValues(): ImportFieldDefaultDto[] {
    const defaultValues = this.defaultFields
      .filter(field => !!this.normalizeFieldValue(field.value))
      .map(field => ({
        targetField: field.field,
        value: this.normalizeFieldValue(field.value) as string,
      }));

    this.customDefaultRows
      .filter(row => !!row.field && !!this.normalizeFieldValue(row.value))
      .forEach(row => {
        defaultValues.push({
          targetField: row.field as string,
          value: this.normalizeFieldValue(row.value) as string,
        });
      });

    return defaultValues;
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
    this.defaultFields = requiredFields
      .filter(field => !this.excludedDefaultFields.includes(field.field))
      .map(field => ({
      field: field.field,
      label: this.getDisplayLabel(field),
      description: field.description,
      controlType: field.controlType,
      valueType: field.valueType,
      options: (field.options || []).map(option => ({ label: option.label, value: option.value })),
      value: currentValues.get(field.field) || (field.controlType === 'SELECT' ? field.options?.[0]?.value : undefined),
    }));
  }

  get customDefaultFieldOptions(): SelectItem[] {
    return (this.preview?.targetFields || [])
      .filter(field => !this.excludedDefaultFields.includes(field.field))
      .map(field => ({
        label: this.getDisplayLabel(field),
        value: field.field,
      }));
  }

  private getDisplayLabel(field?: Pick<ImportTargetFieldDto, 'field' | 'label'>): string {
    if (!field) {
      return '';
    }
    if (field.field === 'profileCode') {
      return this.translate.instant('Profile');
    }
    return field.label || field.field;
  }

  private createMappingRow(targetField?: string, sourceIndex?: number): MappingRowVm {
    const normalizedSourceIndex = sourceIndex ? Number(sourceIndex) : undefined;
    const column = normalizedSourceIndex && this.preview ? (this.preview.columns || [])[normalizedSourceIndex - 1] : undefined;
    return {
      targetField,
      sourceIndex: normalizedSourceIndex,
      sourceKey: column?.field,
      sourceLabel: column?.header || column?.field,
      sampleValue: column ? this.getSourceColumnSampleValue(column, this.preview?.sampleRows || []) : undefined,
    };
  }

  private buildSourceColumnOptionLabel(column: { field: string; header?: string }, sampleRows: any[]): string {
    const label = column.header || column.field;
    const exampleValue = this.getSourceColumnSampleValue(column, sampleRows);
    const normalizedExampleValue = exampleValue === null || exampleValue === undefined ? '' : String(exampleValue).trim();
    return normalizedExampleValue ? `${label} - ${normalizedExampleValue}` : label;
  }

  private getSourceColumnSampleValue(column: { field: string; header?: string }, sampleRows: any[]): string | undefined {
    if (!column?.field || !sampleRows || sampleRows.length === 0) {
      return undefined;
    }

    const candidateRows = sampleRows.slice(0, 2);
    let fallbackValue: string | undefined;

    for (const row of candidateRows) {
      const rawValue = row ? row[column.field] : undefined;
      const value = rawValue === null || rawValue === undefined ? '' : String(rawValue).trim();
      if (!value) {
        continue;
      }
      if (!fallbackValue) {
        fallbackValue = value;
      }
      if (!this.matchesColumnLabel(value, column)) {
        return value;
      }
    }

    return fallbackValue;
  }

  private matchesColumnLabel(value: string, column: { field: string; header?: string }): boolean {
    const normalizedValue = this.normalizeComparisonValue(value);
    if (!normalizedValue) {
      return false;
    }

    const normalizedHeader = this.normalizeComparisonValue(column.header);
    const normalizedField = this.normalizeComparisonValue(column.field);
    return normalizedValue === normalizedHeader || normalizedValue === normalizedField;
  }

  private normalizeComparisonValue(value?: string): string {
    return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  private getDefaultFieldDefinition(field?: string): ImportTargetFieldDto | undefined {
    if (!field || !this.preview) {
      return undefined;
    }
    return (this.preview.targetFields || []).find(targetField => targetField.field === field);
  }

  private createCustomDefaultRow(field: string, value?: string): CustomDefaultRowVm {
    const definition = this.getDefaultFieldDefinition(field);
    const options = (definition?.options || []).map(option => ({ label: option.label, value: option.value }));
    return {
      field,
      label: definition ? this.getDisplayLabel(definition) : field,
      description: definition?.description,
      controlType: definition?.controlType || 'TEXT',
      valueType: definition?.valueType || 'string',
      options,
      value: value || (definition?.controlType === 'SELECT' ? definition.options?.[0]?.value : undefined),
    };
  }
}
