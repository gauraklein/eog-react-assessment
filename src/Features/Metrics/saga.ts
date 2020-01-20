import { takeEvery, call, put, delay } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as MetricsActions, ApiErrorAction } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
// import CurrentMetricData from './CurrentMetricData'

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}
// function* refreshCurrentMetricData(action) {
//   yield delay(2000)
//   yield console.log('refresh current metric data')
//   let result = yield call(MetricsActions.displayCurrentMetricData)
//   console.log(result, 'this is the result')
//   // yield put(result)
//   // yield put(MetricsActions.displayCurrentMetricData(result))
// }

export default function* watchApiError() {
  yield takeEvery(MetricsActions.metricsErrorRecieved.type, apiErrorReceived);
  // yield takeEvery(MetricsActions.displayCurrentMetricData, refreshCurrentMetricData)
}
