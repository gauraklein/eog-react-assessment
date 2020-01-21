import React from 'react';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import MetricPicker from '../Features/Metrics/MetricPicker';
import CurrentMetricData from '../Features/Metrics/CurrentMetricData';


const useStyles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  flex1: {
    flex: 1,
  },
}),
);

//Component to display all metric related features
export default () => {
  
  const classes = useStyles();

  return (
  <div className={classes.container}>
    <div className={classes.flex1}>
    <CurrentMetricData />
    </div>
    <div className="flex1">
    <MetricPicker />
    </div>
  </div>
)};
