export interface ImportLogFailure {
  id: number;
  rowNumber: number;
  customerId?: string;
  deviceId?: string;
  status: string;
  sourceColumn?: string;
  targetField?: string;
  value?: string;
  message: string;
  rawRow?: string;
  createdAt: string;
}
