import { FirebaseContext } from '../config/Firebase';

import React, { PureComponent, useState, useContext, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import moment from 'moment';


// const data = [
//   { date: '2010', accidents: 2, timestamp: 946702800000 },
//   { date: '2011', accidents: 1, timestamp: 949381200000 },
//   { date: '2012', accidents: 0, timestamp: 951886800000 },
//   { date: '2013', accidents: 5, timestamp: 954565200000 },
// ];
function AccidentChart(props) {

  const [data, setData] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        let dataArray = []
        if (props.vehicleInfo && props.accidentCount) {
          let manufactureYear = parseInt(props.vehicleInfo.year)
          let currentYear = parseInt(moment().format('YYYY'))

          for (let i = manufactureYear; i <= currentYear; i++) {
            props.accidentCount.forEach((element) => {
              if(element.year == i.toString()){
                console.log("match",element)
                dataArray.push({"year": i.toString(), "accidents":element.ACC_COUNT})
                ++i;
              }
            })
            dataArray.push({"year": i.toString(), "accidents":0})
          }
          setData(dataArray)

        }

      } catch (error) {
        console.log(error);
      }
    })()
  }, [])


  return (
    <ScatterChart
      width={400}
      height={400}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }}
    >
      <CartesianGrid />
      <XAxis
        dataKey="year"
        type='category'
        name="year"
      />

      <YAxis type="number" dataKey="accidents" name="accidents" unit=" Accidents" />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Legend />
      <Scatter name="Recorded Accidents" data={data} fill="#ff0000" line />
    </ScatterChart>
  );
};
export default AccidentChart;