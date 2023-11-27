import { ResponsiveContainer, YAxis, XAxis, Bar, BarChart, CartesianGrid } from 'recharts';
import { PureComponent } from 'react';
import { Lane } from '../../interfaces/Lane';
import { ChartData } from './PipelineView';

interface ChartProps {
  data: ChartData[];
  colors: string[];
  lanes: Lane[];
}

export class PipelineChart extends PureComponent<ChartProps> {
  render() {
    const { colors, lanes, data } = this.props;

    return (
      <div
        style={{
          maxWidth: '100vw',
        }}
      >
        <ResponsiveContainer width="100%" height="100%" aspect={2.6}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />

            {lanes.map((lanes, index) => {
              return <Bar key={lanes._id} dataKey={lanes._id} stackId="a" fill={colors[index]} />;
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
