import { useThemeColors } from '/@src/composable/useThemeColors'
const themeColors = useThemeColors()

export const completionOptions = {
  series: [
    {
      name: 'Pending',
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: 'Completed',
      data: [11, 32, 45, 32, 34, 52, 41],
    },

  ],
  chart: {
    height: 295,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: [themeColors.accent, themeColors.info, themeColors.green],
  legend: {
    position: 'top',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2, 2],
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2020-02-19T00:00:00.000Z',
      '2020-03-20T01:30:00.000Z',
      '2020-04-21T02:30:00.000Z',
      '2020-05-22T03:30:00.000Z',
      '2020-06-23T04:30:00.000Z',
      '2020-07-24T05:30:00.000Z',
      '2020-08-25T06:30:00.000Z',
    ],
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
}
