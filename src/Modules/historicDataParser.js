// This function feels inefficient and I went down a bit of a rabbit hole with my thinking here
// In a working environment I would have reached out to a senior for some guidance on the best way to
// parse the query results

export const parseHistoricData = historicMetricData => {
  const historicDataForRecharts = [];

  historicMetricData[0].measurements.map((timestampObject, index) => {
    const allValuesForTimestamp = {
      timestamp: timestampObject.at,
      waterTempValue: historicMetricData[0].measurements[index].value,
      waterTempUnit: 'F',
      casingPressureValue: historicMetricData[1].measurements[index].value,
      casingPressureUnit: 'PSI',
      injValveOpenValue: historicMetricData[2].measurements[index].value,
      injValveOpenUnit: '%',
      flareTempValue: historicMetricData[3].measurements[index].value,
      flareTempUnit: 'F',
      oilTempValue: historicMetricData[4].measurements[index].value,
      oilTempUnit: 'F',
      tubingPressureValue: historicMetricData[5].measurements[index].value,
      tubingPressureUnit: 'F',
    };

    historicDataForRecharts.push(allValuesForTimestamp);

    return null;
  });

  return historicDataForRecharts;
};
