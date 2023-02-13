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
import { DateTime, Interval } from 'luxon';
import { FILTER_BY_NONE } from '../Constants';
import { Currency } from '../components/Currency';
import { Card } from '../interfaces/Card';

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
  const [summary, setSummary] = useState({ amount: 0, count: 0 });
  const [list, setList] = useState([]);
  const users = useSelector(selectUsers);

  const setRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    setEnd(range.end);
    setStart(range.start);
  };

  useEffect(() => {
    start.toString();
    end.toString();

    const execute = async () => {
      const summary = await client!.fetchForecast(
        DateTime.fromISO(start.toString()),
        DateTime.fromISO(end.toString()),
        name
      );
      setSummary(summary);

      const list = await client!.fetchForecastList(
        DateTime.fromISO(start.toString()),
        DateTime.fromISO(end.toString()),
        name
      );
      setList(list);
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

  const getAge = (start: DateTime, end: DateTime) => {
    return Interval.fromDateTimes(start, end).length('days');
  };

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
        <section className="content-box tile">
          <h3 className="name">Closed Won</h3>
          <div>
            <div className="metric">
              <h4>
                <Currency value={summary.amount} />
              </h4>
              <span>Value</span>
            </div>
            <div className="metric">
              <h4>{summary.count}</h4>
              <span>Number of Deals</span>
            </div>
            <div className="metric">
              <h4>
                <Currency
                  value={
                    summary.amount > 0 ? summary.amount / summary.count : 0
                  }
                />
              </h4>
              <span>Average deal value</span>
            </div>
          </div>
        </section>

        <section className="content-box tile">
          <h2>Deals by user</h2>

          <table className="list">
            <tbody>
              <tr>
                <td>Name</td>
                <td>Amount</td>
                <td>Created</td>
                <td>Closed</td>
                <td>Deal Duration</td>
                <td>User</td>
              </tr>
              {list.map((card: Card) => {
                const created = DateTime.fromISO(card.createdAt);
                const closed = DateTime.fromISO(card.updatedAt);

                const user = users.find((user) => user.id === card.user);

                return (
                  <tr key={card.id}>
                    <td>
                      <b>{card.name}</b>
                    </td>
                    <td>
                      <Currency value={card.amount} />
                    </td>
                    <td>{created.toRelative()}</td>
                    <td>{closed.toRelative()}</td>
                    <td>{getAge(created, closed).toFixed(2)} days</td>
                    <td>{user?.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
