import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import TimeSeriesChart from "../components/TimeSeriesChart";

function Home() {
  return (
    <div className="home">
      <h1>Dashboard</h1>
      <TimeSeriesChart />
    </div>
  );
}

export default Home;