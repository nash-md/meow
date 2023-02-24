import { useState } from 'react';
import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Board } from './Board';
import {
  selectCards,
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

  // TODO combine this to one call
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

      let users = await client!.getUsers();

      store.dispatch({
        type: ActionType.USERS,
        payload: [...users],
      });

      let schemas = await client!.fetchSchemas();

      store.dispatch({
        type: ActionType.SCHEMAS,
        payload: [...schemas],
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
        const lane = lanes.find((lane: Lane) => lane.id === card.laneId);

        if (lane && lane.inForecast === true) {
          return card.amount ? acc + card.amount : acc;
        } else {
          return acc;
        }
      }, 0)
    );
  }, [cards]);

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

    if (
      result.source?.droppableId === result.destination?.droppableId &&
      result.source.index === result.destination.index
    ) {
      console.log('guard: lane and index did not change, exit');
      return;
    }

    const card = cards.find((card) => card.id === result.draggableId);

    if (card) {
      if (result.destination.droppableId === 'trash') {
        store.dispatch({
          type: ActionType.CARD_DELETE,
          payload: card,
        });
      } else {
        card!.laneId = result.destination.droppableId;

        store.dispatch({
          type: ActionType.CARD_LANE,
          payload: {
            card: card,
            to: result.destination.droppableId,
            from: result.source.droppableId,
            index: result.destination!.index,
          },
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
          <h2>
            {cards.length} Deals -
            <Currency value={amount} />
          </h2>
          <div style={{ paddingTop: '10px' }}>
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
