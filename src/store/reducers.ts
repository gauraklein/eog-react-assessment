import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/MetricPicker/reducer'

export default {
  weather: weatherReducer,
  metrics: metricsReducer
};
