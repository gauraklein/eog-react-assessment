import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  historicMetricData: {
    waterTemp: {
      metric: 'waterTemp',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
    casingPressure: {
      metric: 'casingPressure',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
    injValveOpen: {
      metric: 'injValveOpen',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
    flareTemp: {
      metric: 'flareTemp',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
    oilTemp: {
      metric: 'oilTemp',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
    tubingPressure: {
      metric: 'tubingPressure',
      measurements: [
        {
          at: 0,
          value: 0,
          unit: 'string',
        },
      ],
    },
  },
};

const slice = createSlice({
  name: 'historicData',
  initialState,
  reducers: {
    //error handling
    ChartErrorRecieved: (state, action: PayloadAction<ApiErrorAction>) => state,

    historicalDataRecieved: (state, action) => {
      console.log('hitReducer');
      console.log(action.payload)
      const metricName = action.payload[0].metric
      console.log(metricName)
      const newHistoricalData = {
        ...state.historicMetricData[metricName]
      }

      newHistoricalData.measurements = action.payload[0].measurements

      state.historicMetricData[metricName] = newHistoricalData
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
