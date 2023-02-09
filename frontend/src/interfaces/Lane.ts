export interface Lane {
  id: string;
  key: string;
  name: string;
  index: number;
  inForecast: boolean;
  color?: string;
}

export interface LaneRequest {
  id: string | undefined;
  name: string;
  index: number;
  inForecast: boolean;
  color?: string;
}
