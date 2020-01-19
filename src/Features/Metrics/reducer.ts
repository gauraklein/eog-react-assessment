import { createSlice, PayloadAction } from 'redux-starter-kit';


export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [],
  selectedMetrics: ["waterTemp"]
};


const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsReceived: (state, action) => {
      // console.log(state.metrics, 'this is state from metrics recieved')
      // console.log(action, 'this is the action payload')
      state.metrics = action.payload;
      // console.log(state.metrics, "this should be updated")
    },

    metricsErrorRecieved: (state, action: PayloadAction<ApiErrorAction>) => state,

    metricClicked: (state, action) => {
      console.log(state, 'this is the state from metric clicked')
      console.log(action.payload, 'this is the action payload')

      if (state.selectedMetrics.includes(action.payload)) {
        return
      }

      const newSelectedMetrics= [
        ...state.selectedMetrics
      ]

      newSelectedMetrics.push(action.payload)
      
      state.selectedMetrics = newSelectedMetrics

    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
