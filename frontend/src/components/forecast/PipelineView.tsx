import { Checkbox } from '@adobe/react-spectrum';
import { useEffect, useState, useRef } from 'react';
import { selectDate, selectLanes, selectToken, store } from '../../store/Store';
import { showModalError } from '../../actions/Actions';
import { DateTime } from 'luxon';
import { getErrorMessage } from '../../helpers/ErrorHelper';
import { useSelector } from 'react-redux';
import { Lane } from '../../interfaces/Lane';
import { FILTER_BY_NONE } from '../../Constants';
import { getRequestClient } from '../../helpers/RequestHelper';
import { PipelineChart } from './PipelineChart';

const colors = [
  '#e60049',
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];

export interface TimeSeriesEntry {
  laneId: string;
  amount: number;
}

export interface TimeSeries {
  month: string;
  lanes: Array<TimeSeriesEntry>;
}

export interface ChartData {
  name: string;
  [key: string]: number | string;
}

interface LaneWithSelection extends Lane {
  isSelected: boolean;
}

const createChartData = (lanes: LaneWithSelection[], payload: TimeSeries[]) => {
  return payload.map((entry) => {
    const chartData: ChartData = {
      name: entry.month,
    };

    entry.lanes.forEach((e) => {
      const lane = lanes.find((lane) => lane._id === e.laneId);

      if (lane?.isSelected) {
        chartData[e.laneId] = e.amount;
      }
    });

    return chartData;
  });
};

export const PipelineView = () => {
  const token = useSelector(selectToken);
  const date = useSelector(selectDate);
  const client = getRequestClient(token);
  const [payload, setPayload] = useState<Array<TimeSeries>>([]);
  const lanes = useSelector(selectLanes);
  const [chartData, setChartData] = useState<Array<ChartData>>([]);

  const [lanesWithSelection, setLanesWithSelection] = useState<Array<LaneWithSelection>>([]);

  useEffect(() => {
    if (!date.start || !date.end) {
      return;
    }

    const execute = async () => {
      try {
        const payload = await client.fetchPipelineGenerated(
          DateTime.fromISO(date.start!),
          DateTime.fromISO(date.end!),
          date.userId === FILTER_BY_NONE.key ? undefined : date.userId
        );

        setPayload(payload);
      } catch (error) {
        console.log(error);

        const message = await getErrorMessage(error);

        store.dispatch(showModalError(message));
      }
    };

    if (date.start && date.end && date.userId && lanes.length > 0) {
      execute();
    }
  }, [date.start, date.end, lanes, date.userId]);

  useEffect(() => {
    const laneList: LaneWithSelection[] = lanes.map((lane) => {
      return { ...lane, isSelected: true };
    });

    setLanesWithSelection(laneList);
  }, [lanes]);

  useEffect(() => {
    setChartData(createChartData(lanesWithSelection, payload));
  }, [lanesWithSelection, payload]);

  const toggleIsSelected = (isSelected: boolean, laneId: string) => {
    console.log(`toogle ${laneId} to ${isSelected}`);

    if (lanesWithSelection.filter((lane) => lane.isSelected).length === 1 && isSelected == false) {
      return;
    }

    const list = lanesWithSelection.map((l) => {
      if (laneId === l._id) {
        return { ...l, isSelected: isSelected };
      } else {
        return { ...l };
      }
    });

    setLanesWithSelection([...list]);
  };

  return (
    <>
      <PipelineChart lanes={lanes} colors={colors} data={chartData} />
      <div className="chart-labels">
        {lanesWithSelection.map((lane: LaneWithSelection, index: number) => {
          return (
            <div
              className="item"
              key={lane._id}
              style={{
                border: `2px solid ${colors[index]}`,
              }}
            >
              <Checkbox
                key={lane._id}
                isSelected={lane.isSelected}
                onChange={(value) => toggleIsSelected(value, lane._id)}
              >
                {lane.name}
              </Checkbox>
            </div>
          );
        })}
      </div>
    </>
  );
};
