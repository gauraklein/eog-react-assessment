import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import Paper from '@material-ui/core/Paper';

import { IState } from '../../store';

// TODO
// Multiple Measurements
// Types for state object
//Making value Refresh

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
  });

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

  const getSelectedMetrics = (state: IState) => {

    const { selectedMetrics, metricMeasurementData  } = state.metrics;
   
    return {
     selectedMetrics,
     metricMeasurementData
    };
  };
  
  export default () => {
    return (
      <Provider value={client}>
        <CurrentMetricData />
      </Provider>
    );
  };

  

  const CurrentMetricData = () => {

    const dispatch = useDispatch();

    
    const { selectedMetrics, metricMeasurementData } = useSelector(getSelectedMetrics);
    
    const metricName = selectedMetrics[0]
    // console.log(metrics, 'this is from use selector')
    const [result] = useQuery({
      query,
      variables: {
          metricName
      }
    });
    // console.log(result, 'this is the result')
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
            <Paper>
                <div>
                    {metricValueData.metric}
                    <br/>
                    {metricValueData.value + " " + metricValueData.unit}
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

