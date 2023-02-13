import { Button } from '@adobe/react-spectrum';
import { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { RequestHelperContext } from '../context/RequestHelperContextProvider';
import { LaneRequest } from '../interfaces/Lane';
import { selectLanes } from '../store/Store';
import { Lane } from './funnel/Lane';

const animals: string[] = [
  'Squirrel',
  'Bear',
  'Raccoon',
  'Lion',
  'Penguin',
  'Walrus',
  'Monkey',
];

interface LaneListItem {
  id: number;
  name: string;
  inForecast: boolean;
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

export const Funnel = () => {
  const [lanes, setLanes] = useState<LaneListItem[]>([]);
  const existingLanes = useSelector(selectLanes);

  const { client } = useContext(RequestHelperContext);

  useEffect(() => {
    const list = existingLanes.map((lane, index) => {
      return {
        id: index,
        name: lane.name,
        inForecast: lane.inForecast,
        color: lane.color,
        externalId: lane.id,
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
    );

    setLanes([...list]);
  };

  const onDragStart = () => {};

  const add = () => {
    const name = animals[10 - lanes.length]
      ? animals[10 - lanes.length]
      : '...';

    setLanes([
      ...lanes,
      {
        id: lanes.length + 1,
        name: name,
        inForecast: true,
      },
    ]);
  };

  const update = (
    index: number,
    item: Pick<LaneListItem, 'inForecast' | 'name'>
  ) => {
    lanes[index].name = item.name;
    lanes[index].inForecast = item.inForecast;
  };

  const remove = (index: number) => {
    const list = removeLane(lanes, index);

    setLanes([...list]);
  };

  const save = () => {
    const updated: LaneRequest[] = lanes.map((lane, index) => {
      return {
        id: lane.externalId,
        name: lane.name,
        index: index,
        color: lane.color,
        inForecast: lane.inForecast,
      };
    });

    client?.updateLanes(updated);
  };

  return (
    <div className="content-box">
      <h2>Funnel</h2>
      <div
        className="setup-funnel"
        style={{
          backgroundColor: '#e6e6e6',
          padding: '10px',
          marginTop: '10px',
        }}
      >
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="fixed">
            {(provided, snaphot) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {lanes.map((lane, index) => {
                    return (
                      <Lane
                        id={lane.id}
                        key={lane.id}
                        index={index}
                        name={lane.name}
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
        <Button onPress={save} variant="primary">
          Save
        </Button>
      </div>
    </div>
  );
};
