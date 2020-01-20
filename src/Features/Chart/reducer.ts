import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type HistoricMetricData = {
  historicMetricData: Array<any>
}

const initialState = {
  historicMetricData: [
    {
      metric: "string",
      measurements: [
       { at: 0,
        value: 0,
        unit: "string"
       }
      ]
    }
  ]
    
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

      const nextState = {
        ...state
      }

      nextState.historicMetricData = action.payload

      return nextState

      // const newHistoricalData = {
      //   ...state.historicMetricData[metricName]
      // }

      // newHistoricalData.measurements = action.payload[0].measurements

      // state.historicMetricData[metricName] = newHistoricalData
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
