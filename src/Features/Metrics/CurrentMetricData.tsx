import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery} from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
// import Chip from '../../components/Chip';
import Paper from '@material-ui/core/Paper';


import { IState } from '../../store';

// TODO
// Multiple Measurements
// Types for state object
//Making value Refresh DONE
//updating values in object as opposed to adding new one


//For Graphql
const client = createClient({
    url: 'https://react.eogresources.com/graphql',
    
  });
  
  //Gives Current Timestamp
  const heartbeatQuery = `
    query {
      heartBeat
    }
  `

  //gives a metric object with current values

  const query = `
  query($metricName: String! ) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
  `;

  //pulls from redux store
  const getSelectedMetrics = (state: IState) => {

    
    const { selectedMetrics, metricMeasurementData  } = state.metrics;
   
    return {
     selectedMetrics,
     metricMeasurementData
    };
  };
  
  //Componenent Export
  export default () => {
    return (
      <Provider value={client}>
        <RenderSelectedMetrics />
        {/* <CurrentMetricData /> */}
      </Provider>
    );
  };
    //renders
    const RenderSelectedMetrics = () => {
      const { selectedMetrics} = useSelector(getSelectedMetrics);
      console.log(selectedMetrics, 'these are the selected metrics')
      return (
        <div>
        {selectedMetrics.map((singleMetric) => {
          return (
            <Paper key={singleMetric}>
              <h1>{singleMetric}</h1>
                <CurrentMetricData metricNameObject={singleMetric}/>
            </Paper>
          )
        })}
        </div>
      )
    }
    
  
  //PRINT AN ARRAY THEN MAP TO GET LAST KNOWN MEASUREMENT FOR EACH SELECTED METRIC

  //returns a paper component with metric information
  const CurrentMetricData = (metricNameObject) => {
    const metricName = metricNameObject.metricNameObject
    console.log(metricNameObject, 'this si teh metric name')
    //Redux
    const dispatch = useDispatch();
    //makes selected metrics and measurements available in component
    const {metricMeasurementData } = useSelector(getSelectedMetrics);
    
    //this should go into the map function
    // const metricName = selectedMetrics[0]
    const [result] = useQuery({
      query,
      variables: {
          metricName
      }, 
      pollInterval: 1300, 
      requestPolicy: 'cache-and-network',
    });
    // result of graphql query
    const { fetching, data, error } = result;
    //does something based on graphql query
    useEffect(() => {

      if (error) {
        dispatch(actions.metricsErrorRecieved({ error: error.message }));
        return;
      }
      
      if (!data) return;

      const { getLastKnownMeasurement } = data;

    
      dispatch(actions.displayCurrentMetricData(getLastKnownMeasurement));
    }, [dispatch, data, error]);
    

    if (fetching) return <LinearProgress />;

    const renderCurrentValue = (metricValueData) => {

        return (
           
                <div>
                    {metricValueData.metric}
                    <br/>
                    {metricValueData.value + " " + metricValueData.unit}
                    <br/>
                    {metricValueData.at}
                </div>
        )
    
      }

    console.log(metricMeasurementData, 'this is the metricMeasurementData')
    return (
        <div>
            <h2>
              {metricMeasurementData[metricName].value + " " + metricMeasurementData[metricName].unit} 
            </h2>
        </div>     

    )
  };

