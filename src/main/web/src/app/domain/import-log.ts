export interface ImportLog {
  id: number;
  type: string;
  status: string;
  count: number;
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  importedAt: string;
  message: string;
  hasFailureDetails?: boolean;
  failureDetails?: string;
}
