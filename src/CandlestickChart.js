import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';

const CandlestickChart = () => {
  const [coin, setCoin] = useState('ethusdt');  
  const [interval, setInterval] = useState('1m');  
  const [chartData, setChartData] = useState([]);  
  const [chartInstance, setChartInstance] = useState(null);  

  useEffect(() => {
   
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}@kline_${interval}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      
      const candlestick = {
        time: data.k.t,
        open: parseFloat(data.k.o),
        high: parseFloat(data.k.h),
        low: parseFloat(data.k.l),
        close: parseFloat(data.k.c),
      };

     
      setChartData((prevData) => [...prevData, candlestick]);
    };

    return () => ws.close();
  }, [coin, interval]);  

  useEffect(() => {
  
    const ctx = document.getElementById('candlestickChart').getContext('2d');

    if (chartInstance) {
      
      chartInstance.destroy();
    }

  
    const newChartInstance = new Chart(ctx, {
      type: 'line',  
      data: {
        labels: chartData.map((c) => new Date(c.time).toLocaleTimeString()),
        datasets: [{
          label: `${coin.toUpperCase()} - ${interval}`,
          data: chartData.map((c) => c.close),
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      }
    });

    
    setChartInstance(newChartInstance);

    
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [chartData]); 

  return (
    <div>
      <h3>{coin.toUpperCase()} - {interval}</h3>

    
      <select onChange={(e) => setCoin(e.target.value)} value={coin}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

     
      <select onChange={(e) => setInterval(e.target.value)} value={interval}>
        <option value="1m">1 Minute</option>
        <option value="3m">3 Minutes</option>
        <option value="5m">5 Minutes</option>
      </select>

     
      <canvas id="candlestickChart"></canvas>
    </div>
  );
};

export default CandlestickChart;
