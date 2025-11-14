
export interface RainfallRecord {
  duration: string;
  '2-yr': number;
  '5-yr': number;
  '10-yr': number;
  '25-yr': number;
  '50-yr': number;
  '100-yr': number;
}

export interface RainfallData {
  intensityData: RainfallRecord[];
  depthData: RainfallRecord[];
}
