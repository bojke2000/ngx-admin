import { TemplateMapping } from './template-mapping';
export interface TemplateDto {
  id: string;
  name: string;
  mappings: TemplateMapping[];
}
