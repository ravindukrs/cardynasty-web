// import React, { useState, useContext, useEffect } from "react";
// import { Timeline, Radio, Collapse } from 'antd';
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

const data = [
    {date: '2000-01-01', price: 958, timestamp: 946702800000},
    {date: '2000-02-01', price: 163, timestamp: 949381200000},
    {date: '2000-03-01', price: 163, timestamp: 951886800000},
    {date: '2000-04-02', price: 163, timestamp: 954565200000},
    {date: '2000-05-03', price: 163, timestamp: 957153600000},
    {date: '2000-06-04', price: 163, timestamp: 959832000000},
    {date: '2000-07-01', price: 293, timestamp: 962424000000},
  ];
function Chart(props) {
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
           dataKey="date" 
           type='category'
           name="timestamp"
        />

        <YAxis type="number" dataKey="odometer" name="odometer" unit=" KM" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Scatter name="Odometer Variation" data={props.odometerData} fill="#8884d8" line/>
      </ScatterChart>
    );
};
export default Chart;