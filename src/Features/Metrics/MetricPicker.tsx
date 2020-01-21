import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
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
  const { metrics, selectedMetrics } = state.metrics;
  return {
    metrics,
    selectedMetrics
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      marginTop: 50,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



const MetricPicker = () => {
  const classes = useStyles();
  const theme = useTheme();
  //adds a clicked metric to the selectedMetrics array in redux store
 
  //Redux
  const dispatch = useDispatch();
  //grabs metrics for use in component
  const { metrics, selectedMetrics } = useSelector(getMetrics);
  //query result
  const [result] = useQuery({
    query,
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
    //from result
    const { getMetrics } = data;
    //dispatch
    dispatch(actions.metricsReceived(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  // Need to change this to a select and add a delete function
  const handleMetricClick = (event) => {
    let metricArray = event.target.value
    let singleMetric = event.target.value[metricArray.length - 1]
    console.log(singleMetric, "this is the single metric")
    console.log(event.target)
    dispatch(actions.metricClicked(singleMetric));
  };
  const handleMetricDelete = (metricToDelete) => {
    console.log(metricToDelete)
    dispatch(actions.metricDelete(metricToDelete))
  }
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
                onDelete={(e) => {
                  handleMetricDelete(value)
                }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metrics.map(singleMetric => {
            return (
              <MenuItem
                key={singleMetric}
                value={singleMetric} 
              >
                {singleMetric}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
