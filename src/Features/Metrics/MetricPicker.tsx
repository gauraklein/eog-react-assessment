import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import Paper from '@material-ui/core/Paper';

import { IState } from '../../store';

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
  });
  
  const query = `
  query {
    getMetrics 
  }
  `;
  
  const getMetrics = (state: IState) => {

    // console.log(state.metrics, 'this is state.metrics')
    const { metrics } = state.metrics;
    // console.log(metrics, 'this is from getMetrics')
    return {
     metrics
    };
  };
  
  export default () => {
    return (
      <Provider value={client}>
        <MetricPicker />
      </Provider>
    );
  };

 
  
  const MetricPicker = () => {
    // console.log('metric picker component')

    const handleMetricClick = (singleMetric: any) => {
      console.log(singleMetric)
      dispatch(actions.metricClicked(singleMetric))
      return
    }

    const dispatch = useDispatch();

    const { metrics } = useSelector(getMetrics);
    // console.log(metrics, 'this is from use selector')
    const [result] = useQuery({
      query
    });
    // console.log(result, 'this is the result')
    const { fetching, data, error } = result;

    useEffect(() => {

      if (error) {
        dispatch(actions.metricsErrorRecieved({ error: error.message }));
        return;
      }

      if (!data) return;

      const { getMetrics } = data;

      // console.log(getMetrics, "This is metricsData")
    
      dispatch(actions.metricsReceived(getMetrics));
    }, [dispatch, data, error]);
  
    if (fetching) return <LinearProgress />;
  
    return <Paper>
      TEST
      {metrics.map((singleMetric) => {
        return (
          <Chip key={singleMetric} label={singleMetric} onClick={() => {
            handleMetricClick(singleMetric)
          }} />
        )
      })}
        {/* {console.log(metrics, "in return test")} */}
    </Paper> 
  };

 