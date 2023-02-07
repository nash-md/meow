import { useState } from 'react';
import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Board } from './Board';
import {
  selectCards,
  selectCurrency,
  selectInterfaceState,
  selectLanes,
  store,
} from '../store/Store';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Layer as CardLayer } from './card/Layer';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Trash } from './Trash';
import { Layer as LaneLayer } from './lane/Layer';
import { Lane } from '../interfaces/Lane';
import { Currency } from './Currency';

export const Canvas = () => {
  const cards = useSelector(selectCards);
  const lanes = useSelector(selectLanes);
  const state = useSelector(selectInterfaceState);

  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const execute = async () => {
      let lanes = await client!.getLanes();

      store.dispatch({
        type: ActionType.LANES,
        payload: [...lanes],
      });

      let cards = await client!.getCards();

      store.dispatch({
        type: ActionType.CARDS,
        payload: [...cards],
      });
    };

    if (client) {
      execute();
    }
  }, [client]);

  const showCardDetail = (id?: string) => {
    store.dispatch({
      type: ActionType.USER_INTERFACE_STATE,
      payload: { state: 'card-detail', id: id },
    });
  };

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(
      cards.reduce((acc, card) => {
        const lane = lanes.find((lane: Lane) => lane.key === card.lane);

        if (lane && lane.inForecast === true) {
          return acc + parseInt(card.amount.toString()); // TODO fix date format upon request parsing
        } else {
          return acc;
        }
      }, 0)
    );
  }, [cards, lanes]);

  const onDragEnd = async (result: DropResult) => {
    // TODO exit early if no change in index or destination
    console.log(result);

    const trash = document.getElementById('trash');

    if (trash) {
      trash.style.visibility = 'hidden';
    }

    console.log(
      `move card ${result.draggableId} from lane ${result.source.droppableId} to lane ${result.destination?.droppableId}`
    );

    if (!result.destination?.droppableId) {
      return;
    }

    const card = cards.find((card) => card.id === result.draggableId);

    if (card) {
      if (result.destination.droppableId === 'trash') {
        await client!.deleteCard(card!.id);

        store.dispatch({
          type: ActionType.CARD_DELETE,
          payload: card!.id,
        });
      } else {
        card!.lane = result.destination.droppableId;

        await client!.updateCard(card);

        store.dispatch({
          type: ActionType.CARD_UPDATE,
          payload: card,
        });
      }
    }
  };
  const onDragStart = () => {
    const trash = document.getElementById('trash');

    if (trash) {
      trash.style.visibility = 'visible';
    }
  };

  return (
    <>
      {state === 'card-detail' && <CardLayer />}
      {state === 'lane-detail' && <LaneLayer />}
      <div className="board">
        <div className="title">
          <span style={{ fontSize: '2em' }}>
            {cards.length} Deals -
            <Currency value={amount} />
          </span>
          <div>
            <Button variant="primary" onPress={() => showCardDetail()}>
              Add
            </Button>
          </div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="trash-canvas">
            <Trash />
          </div>

          <div className="lanes">
            <Board lanes={lanes} />
          </div>
        </DragDropContext>
      </div>
    </>
  );
};
