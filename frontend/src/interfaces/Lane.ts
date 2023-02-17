export interface Lane {
  id: string;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}

export interface LaneRequest {
  id: string | undefined;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}

export interface Tags {
  [key: string]: string | boolean;
}
