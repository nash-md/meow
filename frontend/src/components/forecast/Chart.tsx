import { LineChart, Line, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { PureComponent } from 'react';
import { TimeSeries } from '../../pages/StatisticPage';
import { Lane } from '../../interfaces/Lane';

interface ChartProps {
  data: TimeSeries[];
  colors: string[];
  lanes: Lane[];
}

export class Chart extends PureComponent<ChartProps> {
  render() {
    const { data, colors, lanes } = this.props;

    const ticks = data.map((entry, index: number) => (index % 5 === 0 ? entry.date : ''));

    return (
      <div
        style={{
          maxWidth: '100vw',
        }}
      >
        <ResponsiveContainer width="100%" height="100%" aspect={2.6}>
          <LineChart data={data}>
            {lanes.map((lane, index) => {
              return (
                <Line
                  key={lane.id}
                  type="monotone"
                  dataKey={lane.id}
                  stroke={colors[index]}
                  strokeWidth={2}
                  animationDuration={250}
                />
              );
            })}

            <YAxis />
            <XAxis dataKey="date" ticks={ticks} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
