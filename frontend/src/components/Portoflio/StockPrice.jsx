import { useEffect, useState } from "react";

function StockPrice({ symbol }) {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const API_KEY = "YOUR_ALPHA_VANTAGE_KEY"; // <-- visible in frontend!
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const quote = data["Global Quote"];
        setStock({
          price: quote["05. price"],
          change: quote["09. change"],
          changePercent: quote["10. change percent"]
        });
      })
      .catch(err => console.error("Error fetching stock:", err));
  }, [symbol]);

  if (!stock) return <p>Loading...</p>;

  const change = parseFloat(stock.change);
  const isUp = change > 0;

  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold">{symbol}</h2>
      <p className="text-lg">${parseFloat(stock.price).toFixed(2)}</p>
    </div>
  );
}

export default StockPrice;
