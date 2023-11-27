import { today, parseDate, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { DateRangePicker, Item, Picker } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { selectActiveUsers, selectDate, selectInterfaceState, store } from '../store/Store';
import { useSelector } from 'react-redux';
import { ActionType } from '../actions/Actions';
import { FILTER_BY_NONE } from '../Constants';
import { Layer as CardLayer } from '../components/card/Layer';
import { ForecastView } from '../components/forecast/ForecastView';
import { useNavigate } from 'react-router-dom';
import { TrendView } from '../components/forecast/TrendView';
import { PipelineView } from '../components/forecast/PipelineView';

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
  const navigate = useNavigate();

  const date = useSelector(selectDate);
  const users = useSelector(selectActiveUsers);
  const state = useSelector(selectInterfaceState);

  const [userId, setUserId] = useState(date.userId);
  const [view, setView] = useState('');
  const [userSelect, setUserSelect] = useState(true);

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
    setUserId(date.userId);
  }, [date.userId]);

  useEffect(() => {
    if (view === 'pipeline-generated') {
      setUserSelect(false);

      store.dispatch({
        type: ActionType.DATE,
        payload: {
          start: date.start,
          end: date.end,
          userId: FILTER_BY_NONE.key,
        },
      });
    } else {
      setUserSelect(true);
    }

    navigate(`/forecast/${view}`);
  }, [view]);

  const getView = (view: string) => {
    switch (view) {
      case 'pipeline-trend':
        return <TrendView />;
      case 'pipeline-generated':
        return <PipelineView />;
      default:
        return <ForecastView />;
    }
  };

  return (
    <>
      {state === 'card-detail' && <CardLayer />}
      <div className="forecast">
        <div className="filter">
          <div>
            <Picker
              width={240}
              label="Report"
              defaultSelectedKey={view}
              onSelectionChange={(key) => {
                setView(key.toString());
              }}
            >
              <Item key="">Forecast</Item>
              <Item key="pipeline-trend">Sales Pipeline Trend</Item>
              <Item key="pipeline-generated">Sales Pipeline Generated</Item>
            </Picker>
          </div>
          <div className="users">
            <Picker
              width={240}
              label="User"
              isDisabled={!userSelect}
              defaultSelectedKey={userId}
              selectedKey={userId}
              onSelectionChange={(key) => {
                setUserId(key.toString());
              }}
            >
              {[{ _id: FILTER_BY_NONE.key, name: FILTER_BY_NONE.name }, ...users].map((user) => {
                return <Item key={user._id}>{user.name}</Item>;
              })}
            </Picker>
          </div>
          <div className="spacer"></div>
          <div>
            <DateRangePicker
              label="Close Date"
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
        <div className="canvas">{getView(view)}</div>
      </div>
    </>
  );
};
