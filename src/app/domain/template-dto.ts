import { TemplateMapping } from './template-mapping';
export interface TemplateDto {
  id: string;
  label: string;
  mappings: TemplateMapping[];
}
