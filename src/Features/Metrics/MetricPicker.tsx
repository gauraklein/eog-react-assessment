import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { client, metricPickerQuery as query } from '../../Modules/graphqlModules';
import { useStylesMetricPicker as useStyles, MenuProps } from '../../Modules/materialuiModules';
import { IState } from '../../store';

//pulls from redux store
const getMetrics = (state: IState) => {
  const { metrics, selectedMetrics } = state.metrics;
  return {
    metrics,
    selectedMetrics,
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

const MetricPicker = () => {
  //Material
  const classes = useStyles();

  //Redux
  const dispatch = useDispatch();

  //grabs metrics for use in component
  const { metrics, selectedMetrics } = useSelector(getMetrics);

  //query result
  const [result] = useQuery({
    query,
  });

  // status of graphql query
  const { fetching, data, error } = result;
  //Hook
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsErrorRecieved({ error: error.message }));
      return;
    }

    if (!data) return;

    //dispatch
    dispatch(actions.metricsReceived(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  //takes clicked metric and displays current data
  const handleMetricClick = event => {
    //select allows for multiple values which are returned in an array
    let metricArray = event.target.value;

    //pinpointing the most recent one to get added
    let singleMetric = event.target.value[metricArray.length - 1];

    dispatch(actions.metricClicked(singleMetric));
  };

  //removes a metric from selected metrics and returns it to metrics
  const handleMetricDelete = metricToDelete => {
    dispatch(actions.metricDelete(metricToDelete));
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="metricPickerLabel">Pick a Metric!</InputLabel>
        <Select
          labelId="metricPickerLabel"
          id="metricPicker"
          multiple={true}
          value={selectedMetrics}
          onChange={handleMetricClick}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={e => {
                    handleMetricDelete(value);
                  }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metrics.map(singleMetric => {
            return (
              <MenuItem key={singleMetric} value={singleMetric}>
                {singleMetric}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
