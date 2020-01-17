import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricType = {
  data: Array<string>;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: ["waterTemp",
  "oilTemp"]
};


const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsReceived: (state, action) => {
      console.log(state.metrics, 'this is state from metrics recieved')
      console.log(action, 'this is the action payload')
      state.metrics = action.payload;
      console.log(state.metrics, "this should be updated")
    },
    metricsErrorRecieved: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
