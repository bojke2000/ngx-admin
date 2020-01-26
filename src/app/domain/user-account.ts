import * as moment from 'moment'

export interface UserAccount {
  id?: number;
  username: string;
  password: string;
  email: string;
  city: string;
  type: string;
  active: boolean;
  lastLogin: moment.Moment;
}
