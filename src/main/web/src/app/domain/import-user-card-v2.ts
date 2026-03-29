import { Column } from './column';

export interface ImportFieldOptionDto {
  value: string;
  label: string;
}

export interface ImportTargetFieldDto {
  field: string;
  label: string;
  description: string;
  required: boolean;
  controlType: string;
  valueType: string;
  options: ImportFieldOptionDto[];
}

export interface ImportFieldDefaultDto {
  targetField: string;
  value: string;
}

export interface ImportMappingItemDto {
  sourceIndex: number;
  sourceKey: string;
  targetField: string;
}

export interface ImportPreviewResponseDto {
  storedFileName: string;
  originalFileName: string;
  fileType: string;
  delimiter: string;
  columns: Column[];
  sampleRows: any[];
  availableTargetFields: { [key: string]: string };
  targetFields: ImportTargetFieldDto[];
  requiredUnmappedFields: ImportTargetFieldDto[];
}

export interface ImportRowErrorDto {
  rowNumber: number;
  sourceColumn: string;
  targetField: string;
  value: string;
  message: string;
}

export interface ImportValidationResultDto {
  valid: boolean;
  totalRows: number;
  validRows: number;
  skippedRows: number;
  errorRows: number;
  createCount: number;
  updateCount: number;
  importedCount: number;
  profileId?: number;
  requiredUnmappedFields: ImportTargetFieldDto[];
  errors: ImportRowErrorDto[];
}

export interface ImportProfileDto {
  id: number;
  name: string;
  importType: string;
  fileType: string;
  mappingJson: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  active: boolean;
}

export interface ImportExecutionRequestDto {
  profileId?: number;
  profileName?: string;
  storedFileName: string;
  originalFileName?: string;
  fileType: string;
  delimiter?: string;
  skipHeader: boolean;
  cityId: number | string;
  deviceType: number;
  ignoreMissingDeviceId: boolean;
  mappings: ImportMappingItemDto[];
  defaultValues: ImportFieldDefaultDto[];
}
