import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  historicMetricData: [{}],
};

const slice = createSlice({
  name: 'historicData',
  initialState,
  reducers: {
    //error handling
    ChartErrorRecieved: (state, action: PayloadAction<ApiErrorAction>) => state,

    //gets 30 minutes of historical data for all metrics
    historicalDataRecieved: (state, action) => {
      const nextState = {
        ...state,
      };

      nextState.historicMetricData = action.payload;

      return nextState;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
