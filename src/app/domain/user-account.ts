export interface UserAccount {
  id?: number;
  username: string;
  password: string;
  email: string;
  city: string;
  accountType: string;
  active: boolean;
  lastLogin: string;
}
