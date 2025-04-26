import { useEffect, useState } from 'react';
import { Currency } from '../Currency';
import { CardList } from './CardList';
import { Space } from './Space';
import { useSelector } from 'react-redux';
import { selectDate, store, selectToken } from '../../store/Store';
import { DateTime } from 'luxon';
import { FILTER_BY_NONE, DEFAULT_LANGUAGE } from '../../Constants';
import { showModalError } from '../../actions/Actions';
import { getErrorMessage } from '../../helpers/ErrorHelper';
import { getRequestClient } from '../../helpers/RequestHelper';
import { Translations } from '../../Translations';

export const ForecastView = () => {
  const token = useSelector(selectToken);

  const [achieved, setAchieved] = useState({ amount: 0, count: 0 });
  const [predicted, setPredicted] = useState({ amount: 0, count: 0 });
  const date = useSelector(selectDate);

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
            date.userId === FILTER_BY_NONE.key ? undefined : date.userId
          ),
          client.fetchForecastPredicted(
            DateTime.fromISO(date.start),
            DateTime.fromISO(date.end),
            date.userId === FILTER_BY_NONE.key ? undefined : date.userId
          ),
        ]);
        setAchieved(achieved);
        setPredicted(predicted);
      } catch (error) {
        if (client.destroyed) {
          return;
        }

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if ((date.start && date.end, date.userId)) {
      execute();
    }

    return () => {
      client.destroy();
    };
  }, [date.start, date.end, date.userId]);

  return (
    <>
      <section className="content-box tile">
        <h3 className="name">{Translations.ClosedWonOption[DEFAULT_LANGUAGE]}</h3>
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

            <span>{Translations.ValueLabel[DEFAULT_LANGUAGE]}</span>
          </div>

          <Space />

          <div className="metric" style={{ width: '320px' }}>
            <h4>
              <Currency value={predicted.amount} />
            </h4>
            <span>{Translations.PipelineNotClosedYet[DEFAULT_LANGUAGE]}</span>
          </div>

          <Space />

          <div className="metric">
            <h4>
              <Currency value={predicted.amount + achieved.amount} />
            </h4>
            <span>{Translations.PredictionValue[DEFAULT_LANGUAGE]}</span>
          </div>
        </div>

        <div>
          <div className="metric" style={{ width: '320px' }}>
            <h4>{achieved.count}</h4>
            <span>{Translations.NumberOfDeals[DEFAULT_LANGUAGE]}</span>
          </div>

          <Space />

          <div className="metric" style={{ width: '320px' }}>
            <h4>{predicted.count}</h4>
            <span>{Translations.PipelineNotClosedYetDeals[DEFAULT_LANGUAGE]}</span>
          </div>

          <Space />

          <div className="metric">
            <h4>{predicted.count + achieved.count}</h4>
            <span>{Translations.PredictionCount[DEFAULT_LANGUAGE]}</span>
          </div>
        </div>
      </section>

      <CardList userId={date.userId} start={date.start} end={date.end} />
    </>
  );
};
