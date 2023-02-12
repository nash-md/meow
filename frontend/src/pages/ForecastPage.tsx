import {
  today,
  startOfMonth,
  getLocalTimeZone,
  CalendarDate,
} from '@internationalized/date';
import { DateRangePicker, Item, Picker } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { selectUsers, store } from '../store/Store';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { DateTime } from 'luxon';
import { FILTER_BY_NONE } from '../Constants';
import { Currency } from '../components/Currency';

const max = today(getLocalTimeZone());
const min = today(getLocalTimeZone()).subtract({
  years: 1,
  months: 0,
  days: 0,
});

export const ForecastPage = () => {
  const { client } = useContext(RequestHelperContext);
  const [start, setStart] = useState<CalendarDate>(
    startOfMonth(today(getLocalTimeZone()))
  );
  const [end, setEnd] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [name, setName] = useState(FILTER_BY_NONE.key);
  const [forecast, setForecast] = useState({ amount: 0, count: 0 });
  const users = useSelector(selectUsers);

  const setRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    setEnd(range.end);
    setStart(range.start);
  };

  useEffect(() => {
    start.toString();
    end.toString();

    const execute = async () => {
      const data = await client!.fetchForecast(
        DateTime.fromISO(start.toString()),
        DateTime.fromISO(end.toString()),
        name
      );
      setForecast(data);
    };

    if (start && end && client && name) {
      execute();
    }
  }, [client, start, end, name]);

  useEffect(() => {
    const execute = async () => {
      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  return (
    <div className="forecast">
      <div className="filter">
        <div>
          <Picker
            defaultSelectedKey={name}
            onSelectionChange={(key) => {
              setName(key.toString());
            }}
          >
            {[
              { id: FILTER_BY_NONE.key, name: FILTER_BY_NONE.name },
              ...users,
            ].map((user) => {
              return <Item key={user.id}>{user.name}</Item>;
            })}
          </Picker>
        </div>
        <div>
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
        <section className="tile">
          <h2 className="name">Closed Won</h2>
          <div>
            <div className="metric">
              <h4>
                <Currency value={forecast.amount} />
              </h4>
              <span>Value</span>
            </div>
            <div className="metric">
              <h4>{forecast.count}</h4>
              <span>Number of Deals</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
