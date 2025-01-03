import React, { useState, useEffect, useRef } from 'react';
    import { createChart } from 'lightweight-charts';
    import './CurrencyChart.css';

    const CurrencyChart = ({ fromCurrency, toCurrency }) => {
      const chartContainerRef = useRef(null);
      const [chartData, setChartData] = useState([]);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchChartData = async () => {
          if (!fromCurrency || !toCurrency) {
            setError('Please select currencies.');
            setChartData([]);
            return;
          }
          try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);

            const formattedStartDate = startDate.toISOString().slice(0, 10);
            const formattedEndDate = endDate.toISOString().slice(0, 10);

            const response = await fetch(
              `https://api.frankfurter.app/${formattedStartDate}..${formattedEndDate}?from=${fromCurrency}&to=${toCurrency}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.rates && Object.keys(data.rates).length > 0) {
              const formattedData = Object.entries(data.rates).map(([date, rates]) => {
                const baseValue = rates[toCurrency];
                const open = baseValue * (1 + (Math.random() - 0.5) * 0.005);
                const high = baseValue * (1 + Math.random() * 0.01);
                const low = baseValue * (1 - Math.random() * 0.01);
                const close = baseValue * (1 + (Math.random() - 0.5) * 0.005);
                return {
                  time: new Date(date).getTime() / 1000,
                  open: open,
                  high: high,
                  low: low,
                  close: close,
                };
              }).sort((a, b) => a.time - b.time);
              setChartData(formattedData);
              setError(null);
            } else {
              setError('No data available for this currency pair.');
              setChartData([]);
            }
          } catch (err) {
            console.error('Failed to fetch currency chart data:', err);
            setError('Failed to fetch currency chart data');
            setChartData([]);
          }
        };

        fetchChartData();
      }, [fromCurrency, toCurrency]);

      useEffect(() => {
        if (chartContainerRef.current && chartData.length > 0) {
          const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.offsetWidth,
            height: 300,
            layout: {
              background: { color: 'transparent' },
              textColor: 'white',
            },
            grid: {
              vertLines: { visible: false },
              horzLines: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            rightPriceScale: {
              visible: true
            },
            timeScale: {
              visible: true,
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          });

          const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });

          candleSeries.setData(chartData);

          return () => chart.remove();
        }
      }, [chartData]);

      return (
        <div className="currency-chart-container">
          {error && <p>Error: {error}</p>}
          <div ref={chartContainerRef} className="currency-chart" />
        </div>
      );
    };

    export default CurrencyChart;
