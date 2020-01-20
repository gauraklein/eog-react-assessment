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
      timestamp: Number,
      waterTempValue: Number,
      waterTempUnit: String,
      casingPressureValue: Number,
      casingPressureUnit: String,
      injValveOpenValue: Number,
      injValveOpenUnit: String,
      flareTempValue: Number,
      flareTempUnit: String,
      oilTempValue: Number,
      oilTempUnit: String,
      tubingPressureValue: Number,
      tubingPressureUnit: String,
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

      nextState.historicMetricData = parseHistoricData(action.payload)

      return nextState

      // const newHistoricalData = {
      //   ...state.historicMetricData[metricName]
      // }

      // newHistoricalData.measurements = action.payload[0].measurements

      // state.historicMetricData[metricName] = newHistoricalData
    },
  },
});

// This is pretty inefficient and I feel like I went down a bit of a rabbit hole with my thinking Here
// In a working environment I would have reached out to a senior for some guidance on the best way to 
// accomplish this

const parseHistoricData = (historicMetricData) => {

  const historicDataForRecharts: Array<any> = [

  ]

  historicMetricData[0].measurements.map((timestampObject, index) => {
    const allValuesForTimestamp = {
      timestamp: timestampObject.at,
      waterTempValue: historicMetricData[0].measurements[index].value,
      waterTempUnit: "F",
      casingPressureValue: historicMetricData[1].measurements[index].value,
      casingPressureUnit: "PSI",
      injValveOpenValue: historicMetricData[2].measurements[index].value,
      injValveOpenUnit: "%",
      flareTempValue: historicMetricData[3].measurements[index].value,
      flareTempUnit: "F",
      oilTempValue: historicMetricData[4].measurements[index].value,
      oilTempUnit: "F",
      tubingPressureValue: historicMetricData[5].measurements[index].value,
      tubingPressureUnit: "F",
    }
    historicDataForRecharts.push(allValuesForTimestamp)
  })

  return historicDataForRecharts

}
export const reducer = slice.reducer;
export const actions = slice.actions;
