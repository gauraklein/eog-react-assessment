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
    query {
        getMultipleMeasurements(
            input: [
                { metricName: "waterTemp", after: 1579556215250, before: 1579558015250},
                { metricName: "casingPressure", after: 1579556215250, before: 1579558015250},
                { metricName: "injValveOpen", after: 1579556215250, before: 1579558015250},
                { metricName: "flareTemp", after: 1579556215250, before: 1579558015250},
                { metricName: "oilTemp", after: 1579556215250, before: 1579558015250},
                { metricName: "tubingPressure", after: 1579556215250, before: 1579558015250}
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
  
  //pulls from redux store
  const getSelectedMetrics = (state: IState) => {
    const { selectedMetrics, metricMeasurementData } = state.metrics;
    const { historicMetricData } = state.historicData
    return {
      selectedMetrics,
      metricMeasurementData,
      historicMetricData
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
  const { historicMetricData } = useSelector(getSelectedMetrics);
  

  
  //This function should build the input variable for db query
  // const buildQueryInput = (selectedMetrics) => {
  //     const queryInput : Array<any> = []
  //     selectedMetrics.map((individualMetric) => {
  //       const metricInputObject: any = {
  //           metricName: individualMetric,
  //           after: 1579506252649
  //       }
  //       queryInput.push(metricInputObject)
  //       return queryInput
  //     })
  //   //   console.log(queryInput, 'this is the query input')
  //     return queryInput
  // }

//   Instead of having the chart component refresh everytime a new measurement is recieved, I need to set the 
//   start time then push to that item in the redux store

  // const queryVariable = buildQueryInput(['waterTemp', "casingPressure"])
//   console.log(queryVariable, 'this is the query variable')
  
  //db query: polling at the moment but given more time I would dig into subscribing
  const [result] = useQuery({
    query,
    // variables: {
    //   queryVariable
    // },
    // pollInterval: 1300,
    // requestPolicy: 'cache-and-network',
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
      <h1>hello world</h1>
  <p>{}</p>
  
  <LineChart width={600} height={400} data={chartData}>
    <Line type="monotone" dataKey="waterTempValue" yAxisId={0} name="waterTemp" dot={false} stroke="#47E3FF" />
    <Line type="monotone" dataKey="casingPressureValue" yAxisId={1} name="casingPressure" dot={false} stroke="#90FF82" />
    <Line type="monotone" dataKey="injValveOpenValue" yAxisId={2} name="injValveOpen" dot={false} stroke="#FFE344" />
    <Line type="monotone" dataKey="flareTempValue" yAxisId={0} name="flareTemp" dot={false} stroke="#FF7070" />
    <Line type="monotone" dataKey="oilTempValue" yAxisId={0} name="oilTemp" dot={false} stroke="#AB00C1" />
    <Line type="monotone" dataKey="tubingPressureValue" yAxisId={1} name="tubingPressureTemp" dot={false} stroke="#FF3030" />
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

  
   
  })

  return historicDataForRecharts

}


