import { Checkbox } from '@adobe/react-spectrum';
import { useEffect, useState, useRef } from 'react';
import { selectDate, selectLanes, selectToken, store } from '../../store/Store';
import { showModalError } from '../../actions/Actions';
import { DateTime } from 'luxon';
import { getErrorMessage } from '../../helpers/ErrorHelper';
import { useSelector } from 'react-redux';
import { Lane } from '../../interfaces/Lane';
import { FILTER_BY_NONE } from '../../Constants';
import { Chart } from './Chart';
import { getRequestClient } from '../../helpers/RequestHelper';

const colors = [
  '#e60049',
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];

export interface TimeSeriesEntry {
  laneId: string;
  amount: number;
}

export interface TimeSeries {
  date: string;
  lanes: Array<TimeSeriesEntry>;
  [key: string]: number | string | Array<TimeSeriesEntry>;
}

interface LaneWithSelection extends Lane {
  isSelected: boolean;
}

const isValidTimeSeries = (entry: unknown): entry is TimeSeries => {
  if (entry === null) {
    return false;
  }

  if (typeof entry !== 'object') {
    return false;
  }

  if ((entry as TimeSeries).lanes && Array.isArray((entry as TimeSeries).lanes)) {
    return true;
  }

  return false;
};

const createSeriesByLane = (dates: Array<string>, lane: Lane, series: TimeSeries[]) => {
  let previousValue = 0;
  const list = new Array<{ date: string; value: number }>();

  for (let index = 0; index < dates.length; index++) {
    const entry = series.find((item) => item.date === dates[index]);

    if (isValidTimeSeries(entry)) {
      const laneEntry = entry.lanes.find((item) => item.laneId === lane._id);

      previousValue = laneEntry ? laneEntry.amount : previousValue;
    }

    list.push({ date: dates[index], value: previousValue });
  }

  return list;
};

export const TrendView = () => {
  const token = useSelector(selectToken);
  const date = useSelector(selectDate);

  const client = getRequestClient(token);

  const [payload, setPayload] = useState<Array<TimeSeries>>([]);
  const [dates, setDates] = useState<Array<string>>([]);
  const lanes = useSelector(selectLanes);
  const [series, setSeries] = useState<Array<TimeSeries>>([]);

  const [lanesWithSelection, setLanesWithSelection] = useState<Array<LaneWithSelection>>([]);

  useEffect(() => {
    if (!date.start || !date.end) {
      return;
    }

    const s = DateTime.fromISO(date.start);
    const e = DateTime.fromISO(date.end);

    let current = s;
    let dates: Array<string> = [];

    while (current <= e) {
      dates.push(current.toISODate()!);
      current = current.plus({ days: 1 });
    }

    setDates([...dates]);

    const execute = async () => {
      try {
        const payload = await client.fetchLaneTimeSeries(
          DateTime.fromISO(date.start!),
          DateTime.fromISO(date.end!),
          date.userId === FILTER_BY_NONE.key ? undefined : date.userId
        );

        setPayload(payload);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (date.start && date.end && date.userId && lanes.length > 0) {
      execute();
    }
  }, [date.start, date.end, lanes, date.userId]);

  useEffect(() => {
    const laneList: LaneWithSelection[] = lanes.map((lane) => {
      return { ...lane, isSelected: true };
    });

    setLanesWithSelection(laneList);
  }, [lanes]);

  useEffect(() => {
    const data: TimeSeries[] = dates.map((date) => {
      return { date: date, lanes: [] };
    });

    lanesWithSelection.map((lane) => {
      const series = createSeriesByLane(dates, lane, payload);

      series.map((entry, index) => {
        if (lane.isSelected) {
          data[index][lane._id] = entry.value;
        }
      });
    });

    setSeries(data);
  }, [lanesWithSelection, payload]);

  const toggleIsSelected = (isSelected: boolean, laneId: string) => {
    console.log(`toogle ${laneId} to ${isSelected}`);

    if (lanesWithSelection.filter((lane) => lane.isSelected).length === 1 && isSelected == false) {
      return;
    }

    const list = lanesWithSelection.map((l) => {
      if (laneId === l._id) {
        return { ...l, isSelected: isSelected };
      } else {
        return { ...l };
      }
    });

    setLanesWithSelection([...list]);
  };

  return (
    <>
      <div>
        <Chart lanes={lanes} colors={colors} data={series} />
      </div>
      <div className="chart-labels">
        {lanesWithSelection.map((lane: LaneWithSelection, index: number) => {
          return (
            <div
              className="item"
              key={lane._id}
              style={{
                border: `2px solid ${colors[index]}`,
              }}
            >
              <Checkbox
                key={lane._id}
                isSelected={lane.isSelected}
                onChange={(value) => toggleIsSelected(value, lane._id)}
              >
                {lane.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </>
  );
};
