import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import Paper from '@material-ui/core/Paper';
import { IState } from '../../store';
// graphql
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
//query to grab all metrics
const query = `
  query {
    getMetrics 
    heartBeat
  }
  `;
//pulls from redux store
const getMetrics = (state: IState) => {
  const { metrics } = state.metrics;
  return {
    metrics,
  };
};
//exports Component
export default () => {
  return (
    <Provider value={client}>
      <MetricPicker />
    </Provider>
  );
};

//TODO
//Turn this into a select
//chip array that displays the metrics
const MetricPicker = () => {
  //adds a clicked metric to the selectedMetrics array in redux store
  const handleMetricClick = (singleMetric: any) => {
    dispatch(actions.metricClicked(singleMetric));
  };
  //Redux
  const dispatch = useDispatch();
  //grabs metrics for use in component
  const { metrics } = useSelector(getMetrics);
  //query result
  const [result] = useQuery({
    query,
  });

  console.log(result, 'this is the result')
  // status of graphql query -- this is my first time working with graphql and being able to destructure
  // the result like this is awesome!
  const { fetching, data, error } = result;
  //Hook
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsErrorRecieved({ error: error.message }));
      return;
    }

    if (!data) return;
    //from result
    const { getMetrics } = data;
    //dispatch
    dispatch(actions.metricsReceived(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  // Need to change this to a select and add a delete function
  return (
    <Paper>
      TEST
      {metrics.map(singleMetric => {
        return (
          <Chip
            key={singleMetric}
            label={singleMetric}
            onClick={() => {
              handleMetricClick(singleMetric);
            }}
          />
        );
      })}
    </Paper>
  );
};
