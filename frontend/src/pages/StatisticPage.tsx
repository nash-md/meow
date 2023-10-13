import {
  today,
  startOfMonth,
  endOfMonth,
  getLocalTimeZone,
  CalendarDate,
} from '@internationalized/date';
import { Checkbox, DateRangePicker, Item, Picker } from '@adobe/react-spectrum';
import { useEffect, useState, useRef } from 'react';
import { selectActiveUsers, selectLanes, selectToken, store } from '../store/Store';
import { showModalError } from '../actions/Actions';
import { DateTime } from 'luxon';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { useSelector } from 'react-redux';
import { Lane } from '../interfaces/Lane';
import { Link } from 'react-router-dom';
import { FILTER_BY_NONE } from '../Constants';
import { Chart } from '../components/forecast/Chart';
import { getRequestClient } from '../helpers/RequestHelper';

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

const max = today(getLocalTimeZone()).add({
  years: 1,
  months: 0,
  days: 0,
});

const min = today(getLocalTimeZone()).subtract({
  years: 1,
  months: 0,
  days: 0,
});

export const StatisticPage = () => {
  const token = useSelector(selectToken);
  const users = useSelector(selectActiveUsers);
  const [start, setStart] = useState<CalendarDate>(startOfMonth(today(getLocalTimeZone())));
  const [end, setEnd] = useState<CalendarDate>(endOfMonth(today(getLocalTimeZone())));
  const [userId, setUserId] = useState(FILTER_BY_NONE.key);

  const client = getRequestClient(token);

  const setRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    setEnd(range.end);
    setStart(range.start);
  };

  const ref = useRef(null);

  const [payload, setPayload] = useState<Array<TimeSeries>>([]);
  const [dates, setDates] = useState<Array<string>>([]);
  const lanes = useSelector(selectLanes);
  const [series, setSeries] = useState<Array<TimeSeries>>([]);

  const [lanesWithSelection, setLanesWithSelection] = useState<Array<LaneWithSelection>>([]);

  useEffect(() => {
    const s = DateTime.fromISO(start.toString());
    const e = DateTime.fromISO(end.toString());

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
          DateTime.fromISO(start.toString()),
          DateTime.fromISO(end.toString()),
          userId === FILTER_BY_NONE.key ? undefined : userId
        );

        setPayload(payload);

        const data: TimeSeries[] = dates.map((date) => {
          return { date: date, lanes: [] };
        });

        lanes.map((lane) => {
          const series = createSeriesByLane(dates, lane, payload);

          series.map((entry, index) => {
            data[index][lane._id] = entry.value;
          });
        });

        setSeries(data);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (start && end && userId && lanes.length > 0) {
      execute();
    }
  }, [start, end, lanes, userId]);

  useEffect(() => {
    const laneList: LaneWithSelection[] = lanes.map((lane) => {
      return { ...lane, isSelected: true };
    });

    setLanesWithSelection(laneList);
  }, [lanes]);

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

    const data: TimeSeries[] = dates.map((date) => {
      return { date: date, lanes: [] };
    });

    list.map((lane) => {
      const series = createSeriesByLane(dates, lane, payload);

      series.map((entry, index) => {
        if (lane.isSelected) {
          data[index][lane._id] = entry.value;
        }
      });
    });

    setSeries(data);

    setLanesWithSelection([...list]);
  };

  return (
    <>
      <div className="forecast">
        <div className="filter">
          <div>
            <Picker
              defaultSelectedKey={userId}
              onSelectionChange={(key) => {
                setUserId(key.toString());
              }}
            >
              {[{ _id: FILTER_BY_NONE.key, name: FILTER_BY_NONE.name }, ...users].map((user) => {
                return <Item key={user._id}>{user.name}</Item>;
              })}
            </Picker>
          </div>
          <div>
            <b>Close Date</b>&nbsp;
            <DateRangePicker
              aria-label="date"
              value={{
                start: start,
                end: end,
              }}
              maxVisibleMonths={2}
              hourCycle={24}
              onChange={setRange}
              minValue={min}
              maxValue={max}
            />
          </div>
        </div>
        <div className="canvas">
          <div className="forecast-tab">
            <Link to="/forecast">
              <div className="forecast-button">
                <div>
                  <div className="text">Forecast</div>
                </div>
              </div>
            </Link>
          </div>

          <div ref={ref}>
            <Chart lanes={lanes} colors={colors} data={series} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '20px',
              paddingLeft: '60px',
            }}
          >
            {lanesWithSelection.map((lane: LaneWithSelection, index: number) => {
              return (
                <div
                  key={lane._id}
                  style={{
                    border: `2px solid ${colors[index]}`,
                    marginRight: '10px',
                    padding: '5px 8px 5px 8px',
                    borderRadius: '8px',
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
        </div>
      </div>
    </>
  );
};
