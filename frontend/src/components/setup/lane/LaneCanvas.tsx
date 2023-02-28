import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { showModalError, showModalSuccess } from '../../../actions/Actions';
import { ANIMALS, LANE_COLOR } from '../../../Constants';
import { RequestHelperContext } from '../../../context/RequestHelperContextProvider';
import { LaneRequest } from '../../../interfaces/Lane';
import { selectLanes, store } from '../../../store/Store';
import { Lane } from './Lane';

export interface LaneListItem {
  id: number;
  name: string;
  index: number;
  inForecast: boolean;
  type?: string;
  color?: string;
  externalId?: string;
}

function moveLane<T>(lanes: T[], from: number, to: number): T[] {
  const lane = lanes[from];

  const updated = [...lanes];

  updated.splice(from, 1);
  updated.splice(to, 0, lane);

  return updated;
}

function removeLane<T>(lanes: T[], index: number): T[] {
  lanes.splice(index, 1);

  return lanes;
}

export const LanesCanvas = () => {
  const [lanes, setLanes] = useState<LaneListItem[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const existingLanes = useSelector(selectLanes);

  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const list = existingLanes.map((lane, index) => {
      return {
        id: index,
        name: lane.name,
        index: index,
        inForecast: lane.inForecast,
        color: lane.color,
        externalId: lane.id,
        type: lane.tags?.type?.toString() ?? undefined,
      };
    });

    setLanes([...list]);
  }, [existingLanes]);

  const onDragEnd = async (result: DropResult) => {
    console.log(
      `move from ${result.source.index} to ${result.destination?.index}`
    );

    const list = moveLane(
      lanes,
      result.source.index,
      result.destination!.index
    ).map((item, index) => {
      return { ...item, index };
    });

    setLanes([...list]);
  };

  const onDragStart = () => {};

  const add = () => {
    const name = ANIMALS[ANIMALS.length - lanes.length]
      ? ANIMALS[lanes.length]
      : '...';

    setLanes([
      ...lanes,
      {
        id: lanes.length,
        name: name,
        index: lanes.length,
        inForecast: true,
      },
    ]);
  };

  const update = (
    index: number,
    item: Pick<LaneListItem, 'inForecast' | 'name' | 'type'>
  ) => {
    lanes[index].name = item.name;
    lanes[index].inForecast = item.inForecast;
    lanes[index].type = item.type;

    validate();
  };

  const validate = () => {
    if (lanes.some((lane) => !lane.name)) {
      setError('A stage name cannot be empty');
      setIsValid(false);

      return;
    }

    if (!lanes.some((lane) => lane.type === 'closed-won')) {
      // lane type should be a TS type
      setError(
        'At least one stage must be labeled as closed won. This stage will be used to mark opportunities that are won'
      );
      setIsValid(false);

      return;
    }

    if (!lanes.some((lane) => lane.type === 'closed-lost')) {
      // lane type should be a TS type
      setError(
        'At least one stage must be labeled as closed lost. This stage will be used to mark opportunities you lost'
      );
      setIsValid(false);

      return;
    }

    setError('');
    setIsValid(true);
  };

  const remove = (index: number) => {
    const list = removeLane(lanes, index).map((item, index) => {
      return { ...item, index };
    });

    setLanes([...list]);
  };

  const getLaneColorCode = (type: string | undefined) => {
    if (type === 'closed-won') {
      return LANE_COLOR.POSITIVE;
    }

    if (type === 'closed-lost') {
      return LANE_COLOR.NEGATIVE;
    }

    return undefined;
  };

  const save = async () => {
    const updated: LaneRequest[] = lanes.map((lane) => {
      const payload: LaneRequest = {
        id: lane.externalId,
        name: lane.name,
        index: lane.index,
        inForecast: lane.inForecast,
        color: undefined,
      };

      if (lane.type) {
        payload.tags = { type: lane.type };
        payload.color = getLaneColorCode(lane.type);
      }

      return payload;
    });

    try {
      await client?.updateLanes(updated);

      store.dispatch(showModalSuccess());
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
    <div className="content-box">
      <h2>Funnel</h2>

      <div className="setup-funnel">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="fixed">
            {(provided) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {lanes.map((lane) => {
                    return (
                      <Lane
                        id={lane.id}
                        key={lane.id}
                        name={lane.name}
                        index={lane.index}
                        type={lane.type}
                        inForecast={lane.inForecast}
                        remove={remove}
                        update={update}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
        <div className="add-stage">
          <Button onPress={add} variant="secondary">
            Add Stage
          </Button>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <div style={{ marginBottom: '5px' }}>{error}</div>
        <Button onPress={save} variant="primary" isDisabled={!isValid}>
          Save
        </Button>
      </div>
    </div>
  );
};
