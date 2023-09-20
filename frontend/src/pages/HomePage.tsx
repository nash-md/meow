import { useState } from 'react';
import { Button, Item, Picker } from '@adobe/react-spectrum';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCards,
  selectFilters,
  selectInterfaceState,
  selectLanes,
  selectActiveUsers,
  store,
} from '../store/Store';
import {
  ActionType,
  showCardLayer,
  showModalError,
  updateCards,
  updateFilter,
} from '../actions/Actions';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { Layer as CardLayer } from '../components/card/Layer';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Trash } from '../components/Trash';
import { Layer as LaneLayer } from '../components/lane/Layer';
import { Currency } from '../components/Currency';
import { Board } from '../components/Board';
import { Card } from '../interfaces/Card';
import { Translations } from '../Translations';
import { useNavigate } from 'react-router-dom';
import { StatisticsBoard } from '../components/StatisticsBoard';
import { FILTER_BY_NONE } from '../Constants';
import { CardHelper } from '../helpers/CardHelper';
import useMobileLayout from '../hooks/useMobileLayout';
import { getErrorMessage } from '../helpers/ErrorHelper';

export const enum FilterMode {
  OwnedByMe = 'owned-by-me',
  RequireUpdate = 'require-update',
  RecentlyUpdated = 'recently-updated',
}

export const HomePage = () => {
  const cards = useSelector(selectCards);
  const lanes = useSelector(selectLanes);
  const users = useSelector(selectActiveUsers);
  const state = useSelector(selectInterfaceState);
  const filters = useSelector(selectFilters);

  const [mode, setMode] = useState<'board' | 'statistics'>('board');
  const [text, setText] = useState<string>('');
  const [userId, setUserId] = useState(FILTER_BY_NONE.key);

  const { client } = useContext(RequestHelperContext);
  const isMobileLayout = useMobileLayout();

  const navigate = useNavigate();

  const handleFilterToggle = (key: FilterMode) => {
    const updated = new Set(filters.mode);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }

    store.dispatch(updateFilter(updated, userId, text));
  };

  useEffect(() => {
    store.dispatch(updateFilter(new Set(filters.mode), userId, text));
  }, [text, userId]);

  useEffect(() => {
    const execute = async () => {
      try {
        let cards = await client!.getCards();

        store.dispatch(updateCards([...cards]));
      } catch (error) {
        console.error(error);

        store.dispatch(showModalError(await getErrorMessage(error)));
      }
    };

    if (client) {
      execute();
    }
  }, [client]);

  const openCard = (id?: string) => {
    store.dispatch(showCardLayer(id));
  };

  const [amount, setAmount] = useState(0);

  const getTitle = (cards: Card[]) => {
    const count = cards.length;

    return count === 1
      ? `${count} ${Translations.BoardTitle.en}`
      : `${count} ${Translations.BoardTitlePlural.en}`;
  };

  useEffect(() => {
    if (!lanes || !cards) {
      setAmount(0);
      return;
    }

    const lanesWithForecast = lanes.filter((lane) => lane.inForecast === true);

    setAmount(
      CardHelper.filterAll(lanesWithForecast, cards, filters).reduce((acc, card) => {
        return card.amount ? acc + card.amount : acc;
      }, 0)
    );
  }, [cards, lanes, filters]);

  const onDragEnd = async (result: DropResult) => {
    const trash = document.getElementById('trash');

    if (trash) {
      trash.style.opacity = '0.3';
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

    const card = cards.find((card) => card._id === result.draggableId);

    if (card) {
      if (result.destination.droppableId === 'trash') {
        store.dispatch({
          type: ActionType.CARD_DELETE,
          payload: card,
        });
      } else {
        card!.laneId = result.destination.droppableId;

        store.dispatch({
          type: ActionType.CARD_MOVE,
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
      trash.style.opacity = '1';
    }
  };

  if (window.location.pathname !== '/') {
    navigate('/');
    return null;
  }

  return (
    <>
      {state === 'card-detail' && <CardLayer />}
      {state === 'lane-detail' && <LaneLayer />}
      <div className="board">
        <div className="title">
          <div>
            <div className="sum">
              {mode === 'board' && (
                <button
                  className="statistics-button"
                  onClick={() => {
                    setMode('statistics');
                  }}
                ></button>
              )}

              {mode === 'statistics' && (
                <button
                  className="statistics-button"
                  style={{
                    border: '1px solid var(--spectrum-global-color-gray-600)',
                  }}
                  onClick={() => {
                    setMode('board');
                  }}
                ></button>
              )}
              <h2>
                {getTitle(cards)} -
                <Currency value={amount} />
              </h2>

              <div style={{ paddingLeft: '10px' }}>
                <Button variant="primary" onPress={() => openCard()}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="filters-canvas">
            <div>
              <input
                onChange={(event) => setText(event.target.value)}
                placeholder="Search by name or stage"
                aria-label="Name or Stage"
                type="text"
              />
            </div>

            <div>
              <button
                className={`filter ${
                  filters.mode.has(FilterMode.RecentlyUpdated)
                    ? 'recently-updated-active'
                    : 'recently-updated'
                }`}
                onClick={() => handleFilterToggle(FilterMode.RecentlyUpdated)}
              >
                Recently Updated
              </button>
              <Picker
                UNSAFE_style={{ display: 'inline-block' }}
                defaultSelectedKey={userId}
                onSelectionChange={(key) => {
                  setUserId(key.toString());
                }}
              >
                {[{ _id: FILTER_BY_NONE.key, name: FILTER_BY_NONE.name }, ...users].map((user) => {
                  return <Item key={user._id}>{user.name}</Item>;
                })}
              </Picker>
              &nbsp;
              {false && (
                <button
                  className={`filter ${
                    filters.mode.has(FilterMode.OwnedByMe) ? 'owned-by-me-active' : 'owned-by-me'
                  }`}
                  onClick={() => handleFilterToggle(FilterMode.OwnedByMe)}
                >
                  Only My Opportunities
                </button>
              )}
              <button
                className={`filter ${
                  filters.mode.has(FilterMode.RequireUpdate)
                    ? 'require-update-active'
                    : 'require-update'
                }`}
                onClick={() => handleFilterToggle(FilterMode.RequireUpdate)}
              >
                Requires Update
              </button>
            </div>
          </div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {!isMobileLayout && (
            <div className="trash-canvas">
              <Trash />
            </div>
          )}

          <div className="lanes">
            {mode === 'board' && <Board lanes={lanes} />}
            {mode === 'statistics' && <StatisticsBoard lanes={lanes} />}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};
