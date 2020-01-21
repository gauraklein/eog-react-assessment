import { createClient } from 'urql';

//exports client and queries for each of the features

export const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

///CHART\\\

export const chartQuery = `
  query($queryVariable: Timestamp) {
      getMultipleMeasurements(
          input: [
            { metricName: "waterTemp", after: $queryVariable},
            { metricName: "casingPressure", after: $queryVariable},
            { metricName: "injValveOpen", after: $queryVariable},
            { metricName: "flareTemp", after: $queryVariable},
            { metricName: "oilTemp", after: $queryVariable},
            { metricName: "tubingPressure", after: $queryVariable}
          ]
      ) {
        metric
        measurements {
          at
          value
          unit
        }
      }
    }
  `;

///Current Metric Data \\\

export const currentMetricQuery = `
  query($metricName: String! ) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
  `;

///Metric Picker \\\

export const metricPickerQuery = `
  query {
    getMetrics 
    heartBeat
  }
  `;
