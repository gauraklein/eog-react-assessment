import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, Tooltip} from 'recharts';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { IState } from '../../store';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    // width: '95%',
    margin: 10,

  }
}),
);

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
  });
  
  //gives a metric object with current values
  const query = `
    query($queryVariable: Timestamp) {
        getMultipleMeasurements(
            input: [
              { metricName: "waterTemp", after: $queryVariable},
              { metricName: "casingPressure", after: $queryVariable},
              { metricName: "injValveOpen", after: $queryVariable},
              { metricName: "flareTemp", after: $queryVariable},
              { metricName: "oilTemp", after: $queryVariable},
              { metricName: "tubingPressure", after: $queryVariable}
            ]
        ) {
          metric
          measurements {
            at
            value
            unit
          }
        }
      }
    `;

    // const heartBeatQuery = `
    // query {
    //   heartBeat
    // }`
  
  //pulls from redux store
  const getSelectedMetrics = (state: IState) => {
    const { selectedMetrics, metricMeasurementData, timeStamp } = state.metrics;
    const { historicMetricData } = state.historicData
    return {
      selectedMetrics,
      historicMetricData, 
      timeStamp
    };
  };

  //Componenent Export
export default () => {
    return (
      <Provider value={client}>
        <Chart />
      </Provider>
    );
  };

  const Chart = () => {
  const classes = useStyles();
  //Redux
  const dispatch = useDispatch();
  //makes selected metrics and measurements available in component
  const { historicMetricData, selectedMetrics, timeStamp } = useSelector(getSelectedMetrics);

  
  const queryVariable = (timeStamp - 1800000)
  
  const [result] = useQuery({
    query,
    variables: {
      queryVariable
    },
    pollInterval: 1300,
    requestPolicy: 'cache-and-network',
  });


  // status of graphql query -- this is my first time working with graphql and being able to destructure
  // the result like this is awesome!
  const { fetching, data, error } = result;
  //Hook
  useEffect(() => {
    if (error) {
      dispatch(actions.ChartErrorRecieved({ error: error.message }));
      return;
    }

    if (!data) return;



    const { getMultipleMeasurements } = data;

    //the dispatch
    if (data.getMultipleMeasurements.length > 0) {
    dispatch(actions.historicalDataRecieved(getMultipleMeasurements));
    }
  }, [dispatch, data, error]);

  if (selectedMetrics.length > 0 && fetching) return <LinearProgress />;


  if (historicMetricData.length > 1 && selectedMetrics.length > 0) {
    const chartData = parseHistoricData(historicMetricData)

    const tempArray = ["waterTemp", "flareTemp", "oilTemp"]
    const pressureArray = ["tubingPressure", "casingPressure"]

  return (
    
    
    <Paper className={classes.container}>

      <h1>Historical Data</h1>

  <LineChart width={1000} height={500} data={chartData}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="timestamp">
    <Label value="Timestamp" offset={0} position="insideBottom" />
    </XAxis>
    < Tooltip />
    <Legend verticalAlign="top" height={36}/>
    //Lines to render
    { selectedMetrics.includes("waterTemp") ? <Line type="monotone" dataKey="waterTempValue" isAnimationActive={false} yAxisId={0} name="waterTemp" dot={false} stroke="#47E3FF" strokeWidth={1}/> : ''}
    { selectedMetrics.includes("casingPressure") ? <Line type="monotone" dataKey="casingPressureValue" isAnimationActive={false} yAxisId={1} name="casingPressure" dot={false} stroke="#90FF82" strokeWidth={1}/> : ''}
    { selectedMetrics.includes("injValveOpen") ? <Line type="monotone" dataKey="injValveOpenValue" isAnimationActive={false} yAxisId={2} name="injValveOpen" dot={false} stroke="#FFE344" strokeWidth={1}/> : ''}
    { selectedMetrics.includes("flareTemp") ? <Line type="monotone" dataKey="flareTempValue" isAnimationActive={false} yAxisId={0} name="flareTemp" dot={false} stroke="#FF7070" strokeWidth={1}/> : ''}
    { selectedMetrics.includes("oilTemp") ? <Line type="monotone" dataKey="oilTempValue" isAnimationActive={false} yAxisId={0} name="oilTemp" dot={false} stroke="#AB00C1" strokeWidth={1}/> : ''}
    { selectedMetrics.includes("tubingPressure") ? <Line type="monotone" dataKey="tubingPressureValue" isAnimationActive={false} yAxisId={1} name="tubingPressureTemp" dot={false} stroke="#FF3030" strokeWidth={1}/> : ''}
    //YAxes to render
    { tempArray.some(metric => selectedMetrics.includes(metric)) ? <YAxis type="number" yAxisId={0} label={{ value: 'F', angle: 90, position: 'insideTopLeft' }}/> : ''}
    { pressureArray.some(metric => selectedMetrics.includes(metric)) ? <YAxis type="number" yAxisId={1}  label={{ value: 'PSI', angle: 90, position: 'insideTopLeft' }}/> : ''}
    { selectedMetrics.includes("injValveOpen") ? <YAxis type="number" yAxisId={2}  label={{ value: '%', angle: 90, position: 'insideTopLeft' }}/> : ''}
  </LineChart> 

    </Paper>
  )
}

  return <h1></h1>
};
  
// This is pretty inefficient and I feel like I went down a bit of a rabbit hole with my thinking Here
// In a working environment I would have reached out to a senior for some guidance on the best way to 
// accomplish this

const  parseHistoricData = (historicMetricData) => {

  const historicDataForRecharts: Array<any> = [

  ]

  historicMetricData[0].measurements.map((timestampObject, index) => {

    const allValuesForTimestamp = {
      timestamp: timestampObject.at,
      waterTempValue: historicMetricData[0].measurements[index].value,
      waterTempUnit: "F",
      casingPressureValue: historicMetricData[1].measurements[index].value,
      casingPressureUnit: "PSI",
      injValveOpenValue: historicMetricData[2].measurements[index].value,
      injValveOpenUnit: "%",
      flareTempValue: historicMetricData[3].measurements[index].value,
      flareTempUnit: "F",
      oilTempValue: historicMetricData[4].measurements[index].value,
      oilTempUnit: "F",
      tubingPressureValue: historicMetricData[5].measurements[index].value,
      tubingPressureUnit: "F",
    }
    
    historicDataForRecharts.push(allValuesForTimestamp)

    return null
   
  })

  return historicDataForRecharts

}


