import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

// TODO figure out how to set type for selected Metrics

const initialState = {
  metrics: [],
  timeStamp: 0,
  selectedMetrics: ["waterTemp"],
  //Since there were only six metrics I went ahead and wrote them out in initial state
  // I definitely would need to write a better solution if this project was to scale up at all
  metricMeasurementData: {
    waterTemp: {
      at: 0,
      value: 0,
      unit: 'u',
    },
    casingPressure: {
      at: 0,
      value: 0,
      unit: 'u',
    },
    injValveOpen: {
      at: 0,
      value: 0,
      unit: 'u',
    },
    flareTemp: {
      at: 0,
      value: 0,
      unit: 'u',
    },
    oilTemp: {
      at: 0,
      value: 0,
      unit: 'u',
    },
    tubingPressure: {
      at: 0,
      value: 0,
      unit: 'u',
    },
  },
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    //adds metrics from db query to redux store
    metricsReceived: (state, action) => {
      state.metrics = action.payload.getMetrics;
      state.timeStamp = action.payload.heartBeat
    },
    //error handling
    metricsErrorRecieved: (state, action: PayloadAction<ApiErrorAction>) => state,
    //adds a clicked metric to selected metrics array
    metricClicked: (state, action) => {
      //ensures there are no duplicates
      if (state.selectedMetrics.includes(action.payload)) {
        return;
      }

      const newSelectedMetrics = [...state.selectedMetrics];

      newSelectedMetrics.push(action.payload);

      state.selectedMetrics = newSelectedMetrics;
    },
    //displays current values
    displayCurrentMetricData: (state, action) => {
      //for readability
      const metricName = action.payload.metric;
      //just updates the values in corrosponding object
      const newMeasurementData = {
        ...state.metricMeasurementData[metricName],
        at: action.payload.at,
        value: action.payload.value,
        unit: action.payload.unit,
      };
      
      state.metricMeasurementData[metricName] = newMeasurementData;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
