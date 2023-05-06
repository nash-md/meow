import {
  today,
  startOfMonth,
  endOfMonth,
  getLocalTimeZone,
  CalendarDate,
} from '@internationalized/date';
import { DateRangePicker, Item, Picker } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { selectActiveUsers, selectInterfaceState, store } from '../store/Store';
import { useSelector } from 'react-redux';
import { showModalError } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { DateTime } from 'luxon';
import { FILTER_BY_NONE } from '../Constants';
import { Currency } from '../components/Currency';
import { ForecastSpacer } from '../components/card/ForecastSpacer';
import { RequestError } from '../errors/RequestError';
import { RequestTimeoutError } from '../errors/RequestTimeoutError';
import { Layer as CardLayer } from '../components/card/Layer';
import { UserStatus } from '../interfaces/User';
import { CardList } from '../components/forecast/CardList';

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
  const { client } = useContext(RequestHelperContext);
  const [start, setStart] = useState<CalendarDate>(
    startOfMonth(today(getLocalTimeZone()))
  );
  const [end, setEnd] = useState<CalendarDate>(
    endOfMonth(today(getLocalTimeZone()))
  );
  const [userId, setUserId] = useState(FILTER_BY_NONE.key);
  const [achieved, setAchieved] = useState({ amount: 0, count: 0 });
  const [predicted, setPredicted] = useState({ amount: 0, count: 0 });
  const users = useSelector(selectActiveUsers);
  const state = useSelector(selectInterfaceState);

  const setRange = (range: { start: CalendarDate; end: CalendarDate }) => {
    setEnd(range.end);
    setStart(range.start);
  };

  useEffect(() => {
    start.toString();
    end.toString();

    const execute = async () => {
      try {
        const [achieved, predicted] = await Promise.all([
          client!.fetchForecastAchieved(
            DateTime.fromISO(start.toString()),
            DateTime.fromISO(end.toString()),
            userId
          ),
          client!.fetchForecastPredicted(
            DateTime.fromISO(start.toString()),
            DateTime.fromISO(end.toString()),
            userId
          ),
        ]);
        setAchieved(achieved);
        setPredicted(predicted);
      } catch (error) {
        console.log(error);

        if (error instanceof RequestError) {
          const parsed = await error.response.json();

          const text = parsed.description ? parsed.description : parsed.name;
          store.dispatch(showModalError('Failed: ' + text));
        } else if (error instanceof RequestTimeoutError) {
          store.dispatch(
            showModalError('Request Timeout Error, is your backend available?')
          );
        } else if (error instanceof TypeError) {
          store.dispatch(
            showModalError('Network Request Failed, is your backend available?')
          );
        } else {
          store.dispatch(showModalError('Failed: unknown, check JS Console'));
        }
      }
    };

    if (start && end && client && userId) {
      execute();
    }
  }, [client, start, end, userId]);

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
              {[
                { id: FILTER_BY_NONE.key, name: FILTER_BY_NONE.name },
                ...users,
              ].map((user) => {
                return <Item key={user.id}>{user.name}</Item>;
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
          <section className="content-box tile">
            <h3 className="name">Closed Won</h3>
            <div>
              <div className="metric" style={{ width: '320px' }}>
                <div>
                  <h4 style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Currency value={achieved.amount} />{' '}
                  </h4>
                  <span>
                    {(
                      (achieved.amount * 100) /
                      (achieved.amount + predicted.amount)
                    ).toFixed(2)}
                    %
                  </span>
                </div>

                <span>Value</span>
              </div>

              <ForecastSpacer />

              <div className="metric" style={{ width: '320px' }}>
                <h4>
                  <Currency value={predicted.amount} />
                </h4>
                <span>Pipeline - not closed yet</span>
              </div>

              <ForecastSpacer />

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

              <ForecastSpacer />

              <div className="metric" style={{ width: '320px' }}>
                <h4>{predicted.count}</h4>
                <span>Pipeline - not closed yet - Number of Deals</span>
              </div>

              <ForecastSpacer />

              <div className="metric">
                <h4>{predicted.count + achieved.count}</h4>
                <span>Prediction - Count</span>
              </div>
            </div>
          </section>

          <CardList userId={userId} start={start} end={end} />
        </div>
      </div>
    </>
  );
};
