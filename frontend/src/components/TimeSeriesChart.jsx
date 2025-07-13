import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
const data = [
  { time: '2024-06-01', value: 400 },
  { time: '2024-06-02', value: 300 },
  { time: '2024-06-03', value: 200 },
  { time: '2024-06-04', value: 278 },
  { time: '2024-06-05', value: 189 },
];

export default function TimeSeriesChart() {
  return (
    <ResponsiveContainer width={900} height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
  );
}