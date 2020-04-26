
export interface UserCard {
  id?: number;
  customerId: string;
  regNr: number;
  regNr2: number;
  customerName: string;
  address: string;
  addressNo: string;
  addressNo2: string;
  municipality: string;
  route: string;
  readingBook: string;
  variance: number;

  deviceNo: string;
  deviceId: string;
  profile: number;
  medium: string;
  mode: number;
  multiplier: number;

  gsmId: number;
  gsmLongitude: string;
  gsmLatitude: string;

  readTimestamp: string;
  watermeterStatus: number;
  reverseFlowStatus: number;
  diffLastRead: number;
  readDayStatus: number;
  magneticSabotageTime: number;

  signalLevel: number;
  alarms: number;
  mainBattery: number;
  gsmBattery: number;

  customerRemarks: string;
  siteRemarks: string;
  routeRemarks: string;
  gsmRemarks: string;

  device_type: number;
  indexa: number;
  indexb: number;
  indexc: number;
  indexd: number;
}
