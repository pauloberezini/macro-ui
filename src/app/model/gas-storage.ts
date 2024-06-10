export interface StorageResponseDTO {
  lastPage: number;
  total: number;
  dataset: string;
  gasDay: string;
  data: StorageDataItem[];
}

export interface StorageDataItem {
  name: string;
  code: string;
  url: string;
  updatedAt: string;
  gasDayStart: string;
  gasInStorage: number;
  consumption: number;
  consumptionFull: number;
  injection: number;
  withdrawal: number;
  netWithdrawal: number;
  workingGasVolume: number;
  injectionCapacity: number;
  withdrawalCapacity: number;
  contractedCapacity: string;
  availableCapacity: string;
  coveredCapacity: string;
  status: string;
  trend: number;
  full: number;
}
