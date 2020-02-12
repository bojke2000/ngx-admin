export interface MailAccount {
  id: number;
  account: string;
  password: string;
  server: string;
  protocol: string;
  port: number;
  active: string;
  sender: string;
  lastCheck?: string;
}
