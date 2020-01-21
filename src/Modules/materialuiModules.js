import { createStyles, makeStyles } from '@material-ui/core/styles';

// exports basic styling

///CHART\\\

export const useStylesChart = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // width: '95%',
      margin: 10,
    },
  }),
);

///current Metric Data

export const useStylesCurrentMetric = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
    },
    paper: {
      width: 175,
      textAlign: 'center',
      margin: 10,
      marginRight: -2,
    },
  }),
);

/// Metric Picker \\\\

export const useStylesMetricPicker = makeStyles(theme =>
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
export const MenuProps = {
  PaperProps: {
    style: {
      marginTop: 50,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
