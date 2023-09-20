export interface Lane {
  _id: string;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}

export interface LaneRequest {
  _id: string | undefined;
  name: string;
  index: number;
  inForecast: boolean;
  tags?: Tags;
  color?: string;
}

export interface LaneStatistic {
  _id: string;
  timeInLaneAvg: number;
  timeSinceCreationAvg: number;
  cycleTimeAvg: number;
  count: number;
}

export enum LaneType {
  ClosedWon = 'closed-won',
  ClosedLost = 'closed-lost',
  Normal = 'normal',
}

export interface Tags {
  [key: string]: string | boolean;
}
