export interface UserCard {
  id?: number;
  customerId: string;
  customerNo: string;
  customerName: string;
  address: string;
  addressNo: string;
  addressNo2: string;

  deviceId: string;
  gsmId: number;
  wmbusId: number;
  medium: string;

  customerRemarks: string;
  siteRemarks: string;
  routeRemarks: string;
  route: string;
  adogsmLocation: string;
  adogsmRemarks: string;

  multiplier: number;
  readTimestamp: string;
  watermeterStatus: number;
  reverseFlowStatus: number;
  diffLastRead: number;
  readDayStatus: number;
  magneticSabotageTime: number;

  signalStrength: number;
  alarms: number;
  mainBattery: number;
  gsmBattery: number;
}

