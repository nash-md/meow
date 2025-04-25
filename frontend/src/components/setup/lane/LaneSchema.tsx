import { Button } from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { ActionType, showModalError, showModalSuccess } from '../../../actions/Actions';
import { ANIMALS, LANE_COLOR, DEFAULT_LANGUAGE } from '../../../Constants';
import { LaneRequest, LaneType, Tags } from '../../../interfaces/Lane';
import { selectLanes, selectToken, store } from '../../../store/Store';
import { Translations } from '../../../Translations';
import { Lane } from './Lane';
import { getRequestClient } from '../../../helpers/RequestHelper';

const protocol = window.location.protocol;
const domain = window.location.hostname;

export interface LaneListItem {
  id: string;
  name: string;
  index: number;
  inForecast: boolean;
  type?: LaneType;
  color?: string;
  tags?: Tags;
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

export interface LanesSchemaProps {
  isDeveloperMode: boolean;
}

export const LanesSchema = ({ isDeveloperMode }: LanesSchemaProps) => {
  const [lanes, setLanes] = useState<LaneListItem[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState<string | undefined>();
  const existingLanes = useSelector(selectLanes);

  const token = useSelector(selectToken);

  const client = getRequestClient(token);

  useEffect(() => {
    const list = existingLanes.map((lane, index) => {
      return {
        id: lane._id,
        name: lane.name,
        index: index,
        inForecast: lane.inForecast,
        color: lane.color,
        externalId: lane._id,
        tags: lane.tags,
        type: (lane.tags?.type?.toString() as LaneType) ?? undefined,
      };
    });

    setLanes([...list]);
  }, [existingLanes]);

  const onDragEnd = async (result: DropResult) => {
    console.log(`move from ${result.source.index} to ${result.destination?.index}`);

    const list = moveLane(lanes, result.source.index, result.destination!.index).map(
      (item, index) => {
        return { ...item, index };
      }
    );

    setLanes([...list]);
  };

  const onDragStart = () => {};

  const add = () => {
    const name = ANIMALS[ANIMALS.length - lanes.length] ? ANIMALS[lanes.length] : '...';

    setLanes([
      ...lanes,
      {
        id: lanes.length.toString(),
        name: name,
        index: lanes.length,
        inForecast: true,
        type: LaneType.Normal,
      },
    ]);
  };

  const update = (
    index: number,
    item: Pick<LaneListItem, 'inForecast' | 'name' | 'type' | 'tags'>
  ) => {
    lanes[index].name = item.name;
    lanes[index].inForecast = item.inForecast;
    lanes[index].type = item.type;

    if (item.tags) {
      lanes[index].tags = { ...item.tags };
    }

    validate();
  };

  const validate = () => {
    if (lanes.some((lane) => !lane.name)) {
      setError(Translations.StageNameEmptyError[DEFAULT_LANGUAGE]);
      setIsValid(false);

      return;
    }

    if (!lanes.some((lane) => lane.type === LaneType.ClosedWon)) {
      setError(Translations.NeedClosedWonStageError[DEFAULT_LANGUAGE]);
      setIsValid(false);

      return;
    }

    if (!lanes.some((lane) => lane.type === LaneType.ClosedLost)) {
      setError(Translations.NeedClosedLostStageError[DEFAULT_LANGUAGE]);
      setIsValid(false);

      return;
    }

    setError('');
    setIsValid(true);
  };

  const remove = (index: number) => {
    setWarning(Translations.LaneRemovedWarning[DEFAULT_LANGUAGE]);

    const list = removeLane(lanes, index).map((item, index) => {
      return { ...item, index };
    });

    setLanes([...list]);
  };

  const getLaneColorCode = (type: string | undefined) => {
    if (type === LaneType.ClosedWon) {
      return LANE_COLOR.POSITIVE;
    }

    if (type === LaneType.ClosedLost) {
      return LANE_COLOR.NEGATIVE;
    }

    return undefined;
  };

  const save = async () => {
    const updated: LaneRequest[] = lanes.map((lane) => {
      const payload: LaneRequest = {
        _id: lane.externalId,
        name: lane.name,
        index: lane.index,
        inForecast: lane.inForecast,
        color: undefined,
        tags: lane.tags,
      };

      if (lane.type) {
        payload.tags = { ...lane.tags, type: lane.type };
        payload.color = getLaneColorCode(lane.type);
      }

      return payload;
    });

    try {
      const lanes = await client.updateLanes(updated);

      store.dispatch({
        type: ActionType.LANES,
        payload: [...lanes],
      });

      store.dispatch(showModalSuccess(Translations.SetupChangedConfirmation[DEFAULT_LANGUAGE]));
    } catch (error) {
      console.error(error);

      store.dispatch(showModalError(error?.toString()));
    }
  };

  return (
    <div className="content-box">
      <div className="schema-editor-header">
        <div className="title">
          <h2>{Translations.StagesTitle[DEFAULT_LANGUAGE]}</h2>
        </div>
        {isDeveloperMode ? (
          <div className="endpoint">
            <b>POST/GET:</b> {protocol}//
            {domain}/api/lanes
          </div>
        ) : null}
      </div>

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
                        tags={lane.tags}
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
          <Button aria-label={Translations.AddStageButton[DEFAULT_LANGUAGE]} onPress={add} variant="secondary">
            {Translations.AddStageButton[DEFAULT_LANGUAGE]}
          </Button>
        </div>
        {warning && <div className="remove-stage-warning">{warning}</div>}
      </div>

      <div style={{ marginTop: '10px' }}>
        <div style={{ marginBottom: '5px' }}>{error}</div>
        <Button aria-label={Translations.SaveButton[DEFAULT_LANGUAGE]} onPress={save} variant="primary" isDisabled={!isValid}>
          {Translations.SaveButton[DEFAULT_LANGUAGE]}
        </Button>
      </div>
    </div>
  );
};
