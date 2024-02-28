export interface HistoryLog {
  id: number;
  packageId: number;
  employeeId: number;
  step: number;
  historyNote: string;
}

export interface Item {
  id: number;
  packageId: number;
  itemName: string;
  itemWeight: number;
  itemQuantity: number;
  itemValue: number;
}

export interface Service {
  id: number;
  serviceName: string;
}

export interface Data {
  id: number;
  trackingCode: string;
  nameFrom: string;
  addressFrom: string;
  addressTo: string;
  createdAt: string;
  historyLogs: HistoryLog[];
  items: Item[];
  nameTo: string;
  packageNote: string;
  packageSize: string | null;
  postalCodeFrom: string;
  postalCodeTo: string;
  service: Service;
  serviceId: number;
  status: number;
  step: number;
  totalFee: number;
  updatedAt: string;
  user: any;
  userId: number;
}

export interface TrackingDataItem {
  id: number;
  service: Service;
  feeCharge: number;
  timeProcess: number;
}