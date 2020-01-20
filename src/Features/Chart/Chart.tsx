import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label} from 'recharts';
// import Paper from '@material-ui/core/Paper';
import { IState } from '../../store';

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
  });
  
  //gives a metric object with current values
  const query = `
    query {
        getMultipleMeasurements(
            input: [
                { metricName: "waterTemp", after: 1579504940564, before: 1579506740564},
                { metricName: "casingPressure", after: 1579504940564, before: 1579506740564},
                { metricName: "injValveOpen", after: 1579504940564, before: 1579506740564},
                { metricName: "flareTemp", after: 1579504940564, before: 1579506740564},
                { metricName: "oilTemp", after: 1579504940564, before: 1579506740564},
                { metricName: "tubingPressure", after: 1579504940564, before: 1579506740564}
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
  const { selectedMetrics, historicMetricData, metricMeasurementData } = useSelector(getSelectedMetrics);
  

  
  //This function should build the input variable for db query
  const buildQueryInput = (selectedMetrics) => {
      const queryInput : Array<any> = []
      selectedMetrics.map((individualMetric) => {
        const metricInputObject: any = {
            metricName: individualMetric,
            after: 1579506252649
        }
        queryInput.push(metricInputObject)
        return
      })
    //   console.log(queryInput, 'this is the query input')
      return queryInput
  }

//   Instead of having the chart component refresh everytime a new measurement is recieved, I need to set the 
//   start time then push to that item in the redux store

  const queryVariable = buildQueryInput(['waterTemp', "casingPressure"])
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

  // if everything goes correctly the value gets returned
  return (
    <div>
      <h1>hello world</h1>
  <p>{historicMetricData.waterTemp.measurements[0].value}</p>
  {/* <ResponsiveContainer width={700} height="80%"> */}
  <LineChart width={600} height={400} data={historicMetricData.waterTemp.measurements}>
    <Line type="monotone" dataKey="value" dot={false} stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="at">
    <Label value="Timestamp" offset={0} position="insideBottom" />
    </XAxis>
    <YAxis label={{ value: 'Temperature', angle: 90, position: 'topLeft' }}/>
    <Legend verticalAlign="top" height={36}/>
  </LineChart>
  {/* </ResponsiveContainer> */}
    </div>
  );

}