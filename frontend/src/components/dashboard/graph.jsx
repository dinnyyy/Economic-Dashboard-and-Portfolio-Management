import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Graph({ portfolioId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!portfolioId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`http://localhost:8000/portfolios/${portfolioId}/tracker/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const tracker = await res.json();

        console.log("Tracker response:", tracker); // <-- debug log

        if (!tracker?.dates || !tracker?.portfolio_values) {
          throw new Error("Invalid tracker data format");
        }

        const chartData = tracker.dates.map((date, i) => ({
          date,
          value: tracker.portfolio_values[i],
        }));

        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch tracker data", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [portfolioId]);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (data.length === 0) return <div>No tracker data available.</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
