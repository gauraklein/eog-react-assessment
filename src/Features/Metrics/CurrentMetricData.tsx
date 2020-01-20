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
        <CurrentMetricData />
      </Provider>
    );
  };

  
  //PRINT AN ARRAY THEN MAP TO GET LAST KNOWN MEASUREMENT FOR EACH SELECTED METRIC

  //returns a paper component with metric information
  const CurrentMetricData = () => {
    //Redux
    const dispatch = useDispatch();
    //makes selected metrics and measurements available in component
    const { selectedMetrics, metricMeasurementData } = useSelector(getSelectedMetrics);
    
    //this should go into the map function
    const metricName = selectedMetrics[0]
    const [result] = useQuery({
      query,
      variables: {
          metricName
      }, 
      // pollInterval: 1300, 
      requestPolicy: 'cache-and-network',
    });
    // result of graphql query
    const { fetching, data, error } = result;
 
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
            <Paper key={metricValueData.metric}>
                <div>
                    {metricValueData.metric}
                    <br/>
                    {metricValueData.value + " " + metricValueData.unit}
                    <br/>
                    {metricValueData.at}
                </div>
            </Paper>
        )
    
      }

    console.log(metricMeasurementData)
    return (
        <div>
            test
            {metricMeasurementData.map((metricValueData) => {
                return renderCurrentValue(metricValueData)
                
            })}
        </div>     

    )
  };

