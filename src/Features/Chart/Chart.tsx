import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, Tooltip} from 'recharts';
// import Paper from '@material-ui/core/Paper';
import { IState } from '../../store';
// import { Tooltip } from '@material-ui/core';

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
      metricMeasurementData,
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

  //Redux
  const dispatch = useDispatch();
  //makes selected metrics and measurements available in component
  const { historicMetricData, metricMeasurementData, timeStamp } = useSelector(getSelectedMetrics);
  console.log(timeStamp, 'this is the timestamp')
  
  const queryVariable = (timeStamp - 1800000)
  

// const buildQueryVariable = (metricMeasurementData) => {
  
//   if (!metricMeasurementData.waterTemp) {
//     console.log('returning')
//     return [
//       {metricName: "waterTemp", after: 1579564675591}
//     ]
//   }
  
//   let queryVariableToReturn = [
//     { metricName: "waterTemp", after: metricMeasurementData.waterTemp.at - 1800000},
//     { metricName: "casingPressure", after: metricMeasurementData.waterTemp.at - 1800000},
//     { metricName: "injValveOpen", after: metricMeasurementData.waterTemp.at - 1800000},
//     { metricName: "flareTemp", after: metricMeasurementData.waterTemp.at - 1800000},
//     { metricName: "oilTemp", after: metricMeasurementData.waterTemp.at - 1800000},
//     { metricName: "tubingPressure", after: metricMeasurementData.waterTemp.at - 1800000}
//   ]
  
//   return queryVariableToReturn
  
// }
// const queryVariable = buildQueryVariable
//db query: polling at the moment but given more time I would dig into subscribing
  const [result] = useQuery({
    query,
    variables: {
      queryVariable
    },
    pollInterval: 1300,
    requestPolicy: 'cache-and-network',
  });

//   console.log(result, 'this is the result')
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

    console.log(data, 'this is data')

    const { getMultipleMeasurements } = data;

    //the dispatch
    if (data.getMultipleMeasurements.length > 0) {
    dispatch(actions.historicalDataRecieved(getMultipleMeasurements));
    }
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  console.log(historicMetricData, 'this is the historic metric data')

  if (historicMetricData.length > 1) {
    const chartData = parseHistoricData(historicMetricData)

  return (
    <div>
    
  
  <LineChart width={600} height={400} data={chartData}>
    <Line type="monotone" dataKey="waterTempValue" yAxisId={0} name="waterTemp" dot={false} stroke="#47E3FF" strokeWidth={2}/>
    <Line type="monotone" dataKey="casingPressureValue" yAxisId={1} name="casingPressure" dot={false} stroke="#90FF82" strokeWidth={2}/>
    <Line type="monotone" dataKey="injValveOpenValue" yAxisId={2} name="injValveOpen" dot={false} stroke="#FFE344" strokeWidth={2}/>
    <Line type="monotone" dataKey="flareTempValue" yAxisId={0} name="flareTemp" dot={false} stroke="#FF7070" strokeWidth={2}/>
    <Line type="monotone" dataKey="oilTempValue" yAxisId={0} name="oilTemp" dot={false} stroke="#AB00C1" strokeWidth={2}/>
    <Line type="monotone" dataKey="tubingPressureValue" yAxisId={1} name="tubingPressureTemp" dot={false} stroke="#FF3030" strokeWidth={2}/>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="timestamp">
    <Label value="Timestamp" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis type="number" yAxisId={0} label={{ value: 'F', angle: 90, position: 'insideTopLeft' }}/>
    <YAxis type="number" yAxisId={1}  label={{ value: 'PSI', angle: 90, position: 'insideTopLeft' }}/>
    <YAxis type="number" yAxisId={2}  label={{ value: '%', angle: 90, position: 'insideTopLeft' }}/>
    < Tooltip />
    <Legend verticalAlign="top" height={36}/>
  </LineChart> 
  {/* </ResponsiveContainer> */}
    </div>
  )
}

  return <h1>NO DATA</h1>
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


