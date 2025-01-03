import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { createChart, CrosshairMode } from 'lightweight-charts';
    import './BitcoinChart.css';
    import { FaChartLine } from 'react-icons/fa';
    import PopupChart from '../PopupChart/PopupChart';

    const BitcoinChart = ({ updateInterval, setUpdateInterval, setSelectedSymbol }) => {
      const chartContainerRef = useRef(null);
      const chartRef = useRef(null);
      const [chartData, setChartData] = useState([]);
      const [selectedSymbolInternal, setSelectedSymbolInternal] = useState('BTCUSDT');
      const [isPopupOpen, setIsPopupOpen] = useState(false);

      const cryptoOptions = [
        { label: 'BTC', value: 'BTCUSDT' },
        { label: 'ETH', value: 'ETHUSDT' },
        { label: 'DOGE', value: 'DOGEUSDT' },
        { label: 'XRP', value: 'XRPUSDT' },
        { label: 'APE', value: 'APEUSDT' },
      ];

      const intervals = [
        { label: '5s', value: 5000 },
        { label: '10s', value: 10000 },
        { label: '20s', value: 20000 },
      ];

      const fetchChartData = useCallback(async () => {
        try {
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${selectedSymbolInternal}&interval=15m&limit=100`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const formattedData = data.map((d) => ({
            time: d[0] / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          }));
          setChartData(formattedData);
          if (chartRef.current) {
            const series = chartRef.current.series;
            if (series) {
              series.setData(formattedData);
            }
          }
        } catch (error) {
          console.error('Failed to fetch chart data:', error);
        }
      }, [selectedSymbolInternal]);

      useEffect(() => {
        if (chartContainerRef.current) {
          const newChart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.offsetWidth - 40,
            height: 380,
            layout: {
              background: { color: '#1a2a6c00' },
              textColor: 'white',
              padding: { left: 10, right: 10 },
            },
            crosshair: {
              mode: CrosshairMode.Normal,
            },
            timeScale: {
              timeVisible: true,
              secondsVisible: false,
            },
            grid: {
              vertLines: { color: '#444' },
              horzLines: { color: '#444' },
            },
          });

          const candleSeries = newChart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
          chartRef.current = { chart: newChart, series: candleSeries };
          fetchChartData();
        }
        return () => {
          if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.remove();
          }
        };
      }, [fetchChartData]);

      useEffect(() => {
        const intervalId = setInterval(fetchChartData, updateInterval);
        return () => clearInterval(intervalId);
      }, [fetchChartData, updateInterval]);

      const handleSymbolChange = (symbol) => {
        console.log('BitcoinChart handleSymbolChange:', symbol);
        setSelectedSymbolInternal(symbol);
        setSelectedSymbol(symbol);
      };

      const openPopup = () => {
        setIsPopupOpen(true);
      };

      const closePopup = () => {
        setIsPopupOpen(false);
      };

      return (
        <div>
          <div className="chart-button-selector">
            {cryptoOptions.map((option) => (
              <button
                key={option.value}
                className={`chart-button ${selectedSymbolInternal === option.value ? 'active' : ''}`}
                onClick={() => handleSymbolChange(option.value)}
              >
                {option.label}
              </button>
            ))}
            <button onClick={openPopup} className="chart-button">
              <FaChartLine />
            </button>
          </div>
          <div className="interval-selector">
            {intervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => setUpdateInterval(interval.value)}
                className={`interval-button ${updateInterval === interval.value ? 'active' : ''}`}
              >
                {interval.label}
              </button>
            ))}
          </div>
          <div ref={chartContainerRef} className="bitcoin-chart-container" />
          {isPopupOpen && <PopupChart onClose={closePopup} selectedSymbol={selectedSymbolInternal} />}
        </div>
      );
    };

    export default BitcoinChart;
