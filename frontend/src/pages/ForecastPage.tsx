import { today, parseDate, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { DateRangePicker, Item, Picker } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import {
  selectActiveUsers,
  selectDate,
  selectInterfaceState,
  selectToken,
  store,
} from '../store/Store';
import { useSelector } from 'react-redux';
import { ActionType, showModalError } from '../actions/Actions';
import { DateTime } from 'luxon';
import { FILTER_BY_NONE } from '../Constants';
import { Currency } from '../components/Currency';
import { Space } from '../components/forecast/Space';
import { Layer as CardLayer } from '../components/card/Layer';
import { CardList } from '../components/forecast/CardList';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { Link } from 'react-router-dom';
import { TrendIcon } from '../components/forecast/TrendIcon';
import { getRequestClient } from '../helpers/RequestHelper';

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

export const ForecastPage = () => {
  const token = useSelector(selectToken);

  const [achieved, setAchieved] = useState({ amount: 0, count: 0 });
  const [predicted, setPredicted] = useState({ amount: 0, count: 0 });
  const users = useSelector(selectActiveUsers);
  const state = useSelector(selectInterfaceState);
  const date = useSelector(selectDate);
  const [userId, setUserId] = useState(date.userId);

  const setRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    store.dispatch({
      type: ActionType.DATE,
      payload: {
        start: range.start.toString(),
        end: range.end.toString(),
        userId: userId,
      },
    });
  };

  useEffect(() => {
    store.dispatch({
      type: ActionType.DATE,
      payload: {
        start: date.start,
        end: date.end,
        userId: userId,
      },
    });
  }, [userId]);

  useEffect(() => {
    const client = getRequestClient(token);

    const execute = async () => {
      if (!date.start || !date.end) {
        return;
      }

      try {
        const [achieved, predicted] = await Promise.all([
          client.fetchForecastAchieved(
            DateTime.fromISO(date.start),
            DateTime.fromISO(date.end),
            date.userId === FILTER_BY_NONE.key ? undefined : userId
          ),
          client.fetchForecastPredicted(
            DateTime.fromISO(date.start),
            DateTime.fromISO(date.end),
            date.userId === FILTER_BY_NONE.key ? undefined : userId
          ),
        ]);
        setAchieved(achieved);
        setPredicted(predicted);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if ((date.start && date.end, date.userId)) {
      execute();
    }
  }, [date.start, date.end, date.userId]);

  return (
    <>
      {state === 'card-detail' && <CardLayer />}
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
                start: parseDate(date.start!),
                end: parseDate(date.end!),
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
            <Link to="/statistic">
              <div className="forecast-button">
                <div>
                  <div className="icon">
                    <TrendIcon />
                  </div>
                  <div className="text">Sales Pipeline Trend</div>
                </div>
              </div>
            </Link>
          </div>
          <section className="content-box tile">
            <h3 className="name">Closed Won</h3>
            <div>
              <div className="metric" style={{ width: '320px' }}>
                <div>
                  <h4 style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Currency value={achieved.amount} />{' '}
                  </h4>
                  {achieved.amount + predicted.amount !== 0 ? (
                    <span>
                      {((achieved.amount * 100) / (achieved.amount + predicted.amount)).toFixed(2)}%
                    </span>
                  ) : null}
                </div>

                <span>Value</span>
              </div>

              <Space />

              <div className="metric" style={{ width: '320px' }}>
                <h4>
                  <Currency value={predicted.amount} />
                </h4>
                <span>Pipeline - not closed yet</span>
              </div>

              <Space />

              <div className="metric">
                <h4>
                  <Currency value={predicted.amount + achieved.amount} />
                </h4>
                <span>Prediction - Value</span>
              </div>
            </div>

            <div>
              <div className="metric" style={{ width: '320px' }}>
                <h4>{achieved.count}</h4>
                <span>Number of Deals</span>
              </div>

              <Space />

              <div className="metric" style={{ width: '320px' }}>
                <h4>{predicted.count}</h4>
                <span>Pipeline - not closed yet - Number of Deals</span>
              </div>

              <Space />

              <div className="metric">
                <h4>{predicted.count + achieved.count}</h4>
                <span>Prediction - Count</span>
              </div>
            </div>
          </section>

          <CardList userId={userId} start={date.start} end={date.end} />
        </div>
      </div>
    </>
  );
};
