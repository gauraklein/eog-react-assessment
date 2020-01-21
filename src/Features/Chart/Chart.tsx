import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, Tooltip } from 'recharts';
import Paper from '@material-ui/core/Paper';
import { client, chartQuery as query } from '../../Modules/graphqlModules';
import { useStylesChart as useStyles } from '../../Modules/materialuiModules';
import { parseHistoricData } from '../../Modules/historicDataParser';
import { IState } from '../../store';

const getSelectedMetrics = (state: IState) => {
  const { selectedMetrics, timeStamp } = state.metrics;
  const { historicMetricData } = state.historicData;
  return {
    selectedMetrics,
    historicMetricData,
    timeStamp,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const Chart = () => {
  //styling
  const classes = useStyles();
  //Redux
  const dispatch = useDispatch();
  //makes selected metrics and measurements available in component
  const { historicMetricData, selectedMetrics, timeStamp } = useSelector(getSelectedMetrics);

  //variable used in query - it sets the initial timestamp 30 minutes from the time of load
  //so all metrics will chart from the same timestamp
  const queryVariable = timeStamp - 1800000;

  //Polling here as well, if I had a bit more time I would dig into subscriptions
  const [result] = useQuery({
    query,
    variables: {
      queryVariable,
    },
    pollInterval: 1300, //1.3 seconds
    requestPolicy: 'cache-and-network',
  });

  // status of graphql query
  const { fetching, data, error } = result;
  //Hook
  useEffect(() => {
    if (error) {
      dispatch(actions.ChartErrorRecieved({ error: error.message })); //toast
      return;
    }

    if (!data) return;

    const { getMultipleMeasurements } = data;

    //the dispatch
    if (data.getMultipleMeasurements.length > 0) {
      dispatch(actions.historicalDataRecieved(getMultipleMeasurements));
    }
  }, [dispatch, data, error]);

  //added the length argument to stop the graph from rendering the progress bar on page load
  if (selectedMetrics.length > 0 && fetching) return <LinearProgress />;

  //displays the chart if historic data is available and if there is at least one selected metric
  if (historicMetricData.length > 1 && selectedMetrics.length > 0) {
    //parses db result to feed into recharts
    const chartData = parseHistoricData(historicMetricData);

    //Arrays to determine when certian Yaxes should be rendered
    const tempArray = ['waterTemp', 'flareTemp', 'oilTemp'];
    const pressureArray = ['tubingPressure', 'casingPressure'];

    //Chart Render
    return (
      <Paper className={classes.container}>
        <h1>Historical Data</h1>

        <LineChart width={900} height={500} data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timestamp">
            <Label value="Timestamp" offset={0} position="insideBottom" />
          </XAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          //Lines to render
          {selectedMetrics.includes('waterTemp') ? (
            <Line
              type="monotone"
              dataKey="waterTempValue"
              isAnimationActive={false}
              yAxisId={0}
              name="waterTemp"
              dot={false}
              stroke="#47E3FF"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          {selectedMetrics.includes('casingPressure') ? (
            <Line
              type="monotone"
              dataKey="casingPressureValue"
              isAnimationActive={false}
              yAxisId={1}
              name="casingPressure"
              dot={false}
              stroke="#90FF82"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          {selectedMetrics.includes('injValveOpen') ? (
            <Line
              type="monotone"
              dataKey="injValveOpenValue"
              isAnimationActive={false}
              yAxisId={2}
              name="injValveOpen"
              dot={false}
              stroke="#FFE344"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          {selectedMetrics.includes('flareTemp') ? (
            <Line
              type="monotone"
              dataKey="flareTempValue"
              isAnimationActive={false}
              yAxisId={0}
              name="flareTemp"
              dot={false}
              stroke="#FF7070"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          {selectedMetrics.includes('oilTemp') ? (
            <Line
              type="monotone"
              dataKey="oilTempValue"
              isAnimationActive={false}
              yAxisId={0}
              name="oilTemp"
              dot={false}
              stroke="#AB00C1"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          {selectedMetrics.includes('tubingPressure') ? (
            <Line
              type="monotone"
              dataKey="tubingPressureValue"
              isAnimationActive={false}
              yAxisId={1}
              name="tubingPressureTemp"
              dot={false}
              stroke="#FF3030"
              strokeWidth={1}
            />
          ) : (
            ''
          )}
          //YAxes to render
          {tempArray.some(metric => selectedMetrics.includes(metric)) ? (
            <YAxis type="number" yAxisId={0} label={{ value: 'F', angle: 90, position: 'insideTopLeft' }} />
          ) : (
            ''
          )}
          {pressureArray.some(metric => selectedMetrics.includes(metric)) ? (
            <YAxis type="number" yAxisId={1} label={{ value: 'PSI', angle: 90, position: 'insideTopLeft' }} />
          ) : (
            ''
          )}
          {selectedMetrics.includes('injValveOpen') ? (
            <YAxis type="number" yAxisId={2} label={{ value: '%', angle: 90, position: 'insideTopLeft' }} />
          ) : (
            ''
          )}
        </LineChart>
      </Paper>
    );
  }

  return null;
};
