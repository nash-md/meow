import { useState } from 'react';
import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCards,
  selectInterfaceState,
  selectLanes,
  store,
} from '../store/Store';
import { ActionType } from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Layer as CardLayer } from '../components/card/Layer';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Trash } from '../components/Trash';
import { Layer as LaneLayer } from '../components/lane/Layer';
import { Lane } from '../interfaces/Lane';
import { Currency } from '../components/Currency';
import { Board } from '../components/Board';
import { Card } from '../interfaces/Card';
import { Translations } from '../Translations';

export const enum FilterMode {
  OwnedByMe = 'owned-by-me',
  RequireUpdate = 'require-update',
}

export const HomePage = () => {
  const cards = useSelector(selectCards);
  const lanes = useSelector(selectLanes);
  const state = useSelector(selectInterfaceState);
  const [filters, setFilters] = useState<Set<FilterMode>>(new Set());

  const { client } = useContext(RequestHelperContext);

  const handleFilterToggle = (key: FilterMode) => {
    console.log(key);

    const updated = new Set(filters);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }

    setFilters(updated);
  };

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

  const getTitle = (cards: Card[]) => {
    const count = cards.length;

    return count === 1
      ? `${count} ${Translations.BoardTitle.en}`
      : `${count} ${Translations.BoardTitlePlural.en}`;
  };

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
          <div>
            <div>
              <h2>
                {getTitle(cards)} -
                <Currency value={amount} />
              </h2>
            </div>
            <div style={{ paddingLeft: '10px' }}>
              <Button variant="primary" onPress={() => showCardDetail()}>
                Add
              </Button>
            </div>
          </div>
          <div className="filters-canvas">
            <button
              className={`filter ${
                filters.has(FilterMode.OwnedByMe)
                  ? ' owned-by-me-active'
                  : 'owned-by-me'
              }`}
              onClick={() => handleFilterToggle(FilterMode.OwnedByMe)}
            >
              Only My Opportunities
            </button>

            <button
              className={`filter ${
                filters.has(FilterMode.RequireUpdate)
                  ? ' require-update-active'
                  : 'require-update'
              }`}
              onClick={() => handleFilterToggle(FilterMode.RequireUpdate)}
            >
              Require Updates
            </button>
          </div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="trash-canvas">
            <Trash />
          </div>

          <div className="lanes">
            <Board filters={filters} lanes={lanes} />
          </div>
        </DragDropContext>
      </div>
    </>
  );
};
