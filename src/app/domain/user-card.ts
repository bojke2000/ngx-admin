
export interface UserCard {
  id: number;
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
  profile: string;
  medium: string;
  mode: string;
  multiplier: string;
  unit: string;

  gsmId: string;
  gsmLongitude: string;
  gsmLatitude: string;

  readTimestamp: string;
  usageCurrent: number;
  usageCurrentReverse: number;
  usageCurrentMonth: number;
  diffLastRead: number;
  magneticSabotageTime: number;

  signalLevel: number;
  alarms: number;
  mainBattery: number;
  gsmBattery: number;

  customerRemarks: string;
  siteRemarks: string;
  routeRemarks: string;
  gsmRemarks: string;

  deviceType: number;
  indexa: string;
  indexb: string;
  indexc: string;
  indexd: string;
}
