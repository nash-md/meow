import { useState } from 'react';
import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { Board } from './Board';
import {
  selectCards,
  selectCurrency,
  selectInterfaceState,
  store,
} from '../store/Store';
import { ActionType } from '../actions/Actions';
import { Lane } from '../Constants';
import { lanes as defaults } from '../Constants';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Card } from '../interfaces/Card';
import { CardDetailLayer } from './CardDetailLayer';

export const Canvas = () => {
  const cards = useSelector(selectCards);
  const state = useSelector(selectInterfaceState);
  const currency = useSelector(selectCurrency);

  const [lanes, setLanes] = useState<Lane[]>([]);
  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const execute = async () => {
      let list = await client!.getCards();

      store.dispatch({
        type: ActionType.CARDS,
        payload: [...list],
      });
    };

    if (client) {
      execute();
    }

    setLanes([...defaults]);
  }, [client]);

  const showCardDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'card-detail', id: id },
    });
  };

  const add = async (card: Card) => {
    // TODO should handle Card and CardPreview types
    if (card.id) {
      card = await client!.updateCard(card);
    } else {
      card = await client!.createCard(card);
    }

    store.dispatch({
      type: ActionType.CARD_UPDATE,
      payload: card,
    });
  };

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(
      cards.reduce((acc, card) => {
        const lane = lanes.find((lane: Lane) => lane.key === card.lane);

        if (lane?.isEnd === true) {
          return acc;
        } else {
          return acc + parseInt(card.amount.toString()); // TODO fix date format upon request parsing
        }
      }, 0)
    );
  }, [cards]);

  return (
    <div className="board">
      <div className="title">
        <span style={{ fontSize: '2em' }}>
          {cards.length} Deals -
          {amount.toLocaleString('en-US', {
            style: 'currency',
            currency: currency ?? 'USD',
          })}
        </span>
        <div>
          <Button variant="primary" onPress={() => showCardDetail()}>
            Add
          </Button>
        </div>
        {state === 'card-detail' && <CardDetailLayer add={add} />}
      </div>

      <div className="lanes">
        <DndProvider backend={HTML5Backend}>
          <Board lanes={lanes} />
        </DndProvider>
      </div>
    </div>
  );
};
