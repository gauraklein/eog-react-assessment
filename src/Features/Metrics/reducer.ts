import { createSlice, PayloadAction } from 'redux-starter-kit';


export type ApiErrorAction = {
  error: string;
};

type selectedMetricsType = Array<string>

type metricMeasurementDataType = {
  metric: string,
  at: number,
  value: number,
  unit: string

}

// TODO figure out how to set type for selected Metrics 

const initialState = {
  metrics: [],
  selectedMetrics: ["waterTemp"],
  metricMeasurementData: [
    {
      metric: "test",
      at: 0,
      value: 0,
      unit: "u"
    }
  ]
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

    },

    displayCurrentMetricData: (state, action) => {
      console.log(action.payload)

      const newMeasurementData = [
        ...state.metricMeasurementData,
       
      ]

      newMeasurementData.push(action.payload)

      state.metricMeasurementData = newMeasurementData
    },

    updateCurrentMetricData: (state, action) => {

      console.log(action.payload)
      const updatedMeasurementData = [
        ...state.metricMeasurementData
      ]

      return state


    }

  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
