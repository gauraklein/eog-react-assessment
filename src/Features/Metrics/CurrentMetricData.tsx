import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery, defaultExchanges, subscriptionExchange } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import Paper from '@material-ui/core/Paper';
import { SubscriptionClient} from 'subscriptions-transport-ws'

import { IState } from '../../store';

// TODO
// Multiple Measurements
// Types for state object
//Making value Refresh

// const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', { })

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
    // exchanges: [
    //   ...defaultExchanges,
    //   subscriptionExchange({
    //     forwardSubscription: operation => {
    //       subscriptionClient.request(operation)
    //     }
    //   })
    // ]
  });
  
  const heartbeatQuery = `
    query {
      heartBeat
    }
  `

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
      }, 
      pollInterval: 1300, 
      requestPolicy: 'cache-and-network',
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

