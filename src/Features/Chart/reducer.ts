import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

// export type HistoricMetricData = {
//   historicMetricData: Array<any>
// }

const initialState = {
  historicMetricData: [
    {
      
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
      console.log(action.payload, 'this is the action.payload')

      const nextState = {
        ...state
      }

      nextState.historicMetricData = action.payload
      console.log(nextState, 'this is the nextState')
      return nextState
 
    },
  },
});


export const reducer = slice.reducer;
export const actions = slice.actions;
