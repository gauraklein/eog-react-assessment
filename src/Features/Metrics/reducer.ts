import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

//Please excuse this reducer, I swear I usually don't write code like this :)
//If I were given the opportunity to work further on this feature, the first
//thing I would do is refactor this.

const initialState = {
  metrics: [],
  timeStamp: 0,
  selectedMetrics: [] as any[],
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
      state.timeStamp = action.payload.heartBeat;
    },
    //deletes metrics from selectedMetrics and adds to metrics
    metricDelete: (state, action) => {
      const newMetrics: any = [...state.metrics];
      newMetrics.push(action.payload);
      state.metrics = newMetrics;
      state.selectedMetrics = state.selectedMetrics.filter(value => {
        return value !== action.payload;
      });
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
      state.metrics = state.metrics.filter(value => {
        return value !== action.payload;
      });
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
