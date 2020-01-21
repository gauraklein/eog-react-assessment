import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { client, currentMetricQuery as query } from '../../Modules/graphqlModules';
import { useStylesCurrentMetric as useStyles } from '../../Modules/materialuiModules';
import { IState } from '../../store';

//pulls from redux store
const getSelectedMetrics = (state: IState) => {
  const { selectedMetrics, metricMeasurementData } = state.metrics;
  return {
    selectedMetrics,
    metricMeasurementData,
  };
};

//Componenent Export
export default () => {
  return (
    <Provider value={client}>
      <RenderSelectedMetrics />
    </Provider>
  );
};

//renders metrics and values -- Parent Component
const RenderSelectedMetrics = () => {
  //Material
  const classes = useStyles();
  //selector
  const { selectedMetrics } = useSelector(getSelectedMetrics);

  //checks to make sure something has been selected
  if (selectedMetrics.length > 0) {
    //Takes each metric and renders it onto a Paper Component
    return (
      <div className={classes.container}>
        {selectedMetrics.map(singleMetric => {
          return (
            <Paper className={classes.paper} key={singleMetric}>
              <h2>{singleMetric}</h2>
              <CurrentMetricData metricNameObject={singleMetric} />
            </Paper>
          );
        })}
      </div>
    );
  }

  return null;
};

//queries the backend then renders current value
const CurrentMetricData = metricNameObject => {
  //a quick work around for metricNameObject
  //being passed down as an object as opposed to a string
  const metricName = metricNameObject.metricNameObject;

  //Redux
  const dispatch = useDispatch();

  //makes selected metrics and measurements available in component
  const { metricMeasurementData } = useSelector(getSelectedMetrics);

  //db query: polling at the moment but given more time I would dig into subscribing
  const [result] = useQuery({
    query,
    variables: {
      metricName,
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
      dispatch(actions.metricsErrorRecieved({ error: error.message }));
      return;
    }

    if (!data) return;

    // I decided to go with getLastKnownMeasurement for this Query
    // In retrospect this seems pretty inefficient If I was able to refactor
    // I would probably use getMultipleMeasurements and use that result for current
    // and historical values
    const { getLastKnownMeasurement } = data;

    //the dispatch
    dispatch(actions.displayCurrentMetricData(getLastKnownMeasurement));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  // if everything goes correctly the value gets returned
  return (
    <div>
      <h1>{metricMeasurementData[metricName].value + ' ' + metricMeasurementData[metricName].unit}</h1>
    </div>
  );
};
