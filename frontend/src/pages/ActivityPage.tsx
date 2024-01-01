import { useSelector } from 'react-redux';
import { getRequestClient } from '../helpers/RequestHelper';
import { selectInterfaceState, selectToken, store } from '../store/Store';
import { useEffect, useState } from 'react';
import { showCardLayer, showModalError } from '../actions/Actions';
import { getErrorMessage } from '../helpers/ErrorHelper';
import { Item, Picker } from '@adobe/react-spectrum';
import { DateTime } from 'luxon';
import { ActivityItem } from '../components/activity/ActivityItem';
import { CardEvent } from '../interfaces/CardEvent';
import { Avatar } from '../components/Avatar';
import { Layer as CardLayer } from '../components/card/Layer';
import React from 'react';

export const ActivityPage = () => {
  const state = useSelector(selectInterfaceState);
  const token = useSelector(selectToken);
  const [list, setList] = useState<(CardEvent & { userName: string; cardName: string })[]>([]);
  const [range, setRange] = useState('today');
  const [isLoading, setIsLoading] = useState(false);

  const client = getRequestClient(token);

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  useEffect(() => {
    const execute = async () => {
      try {
        setIsLoading(true);
        setList([]);

        const payload = await client.getActivities({ range: range });

        setList(payload);

        setIsLoading(false);
      } catch (error) {
        console.log(error);

        setIsLoading(false);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    execute();
  }, [range]);

  const renderItems = () => {
    let lastDate = '';

    return list.map((item: CardEvent & { userName: string; cardName: string }, index: number) => {
      const date = DateTime.fromISO(item.createdAt).toFormat('yyyy-MM-dd');
      let isNewDay = false;

      if (lastDate !== date) {
        lastDate = date;
        isNewDay = true;
      }

      return (
        <React.Fragment key={`fragment-${index}`}>
          {isNewDay && (
            <tr key={`headline_${index}`}>
              <td colSpan={3}>
                <h2>
                  {DateTime.fromISO(item.createdAt).toLocaleString({
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
              </td>
            </tr>
          )}
          <tr key={`item-${index}`}>
            <td>
              <Avatar id={item.userId} width={30} />
            </td>
            <td className="title">
              <span onClick={() => openCard(item.cardId)} className="direct-link">
                {item.cardName}
              </span>
            </td>
            <td>
              <ActivityItem item={item} />
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {state === 'card-detail' && <CardLayer />}
      <div className="canvas">
        <Picker
          aria-label="Range"
          defaultSelectedKey={range}
          onSelectionChange={(value) => setRange(value.toString())}
        >
          <Item key="today">Today</Item>
          <Item key="week">This Week</Item>
          <Item key="">Last 90 Days</Item>
        </Picker>

        <div className="spinner-canvas">{isLoading ? <div className="spinner"></div> : null}</div>

        <table className="activity-list">
          <tbody>{renderItems()}</tbody>
        </table>
      </div>
    </>
  );
};
