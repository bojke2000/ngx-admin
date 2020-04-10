import { TemplateMapping } from './template-mapping';
export interface TemplateDto {
  id: string;
  name: string;
  cityId: string;
  mappings: TemplateMapping[];
}
