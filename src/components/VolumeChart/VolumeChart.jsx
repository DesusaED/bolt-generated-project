import React, { useState, useEffect, useRef } from 'react';
    import { createChart } from 'lightweight-charts';
    import './VolumeChart.css';

    const VolumeChart = ({ updateInterval, selectedSymbol }) => {
      const chartRef = useRef(null);
      const [volumeData, setVolumeData] = useState([]);

      useEffect(() => {
        const fetchVolumeData = async () => {
          try {
            const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=1m&limit=60`);
            const data = await response.json();
            const formatted = data.map(d => ({
              time: d[0] / 1000,
              value: parseFloat(d[5]), // Trading volume
              color: parseFloat(d[4]) >= parseFloat(d[1]) ? '#26a69a' : '#ef5350'
            }));
            setVolumeData(formatted);
          } catch (error) {
            console.error('Failed to fetch volume data:', error);
          }
        };

        fetchVolumeData();
        const intervalId = setInterval(fetchVolumeData, updateInterval);
        return () => clearInterval(intervalId);
      }, [updateInterval, selectedSymbol]);

      useEffect(() => {
        if (chartRef.current && volumeData.length) {
          const chart = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: 100,
            layout: {
              background: { color: 'transparent' },
              textColor: 'white',
            },
            grid: {
              vertLines: { visible: false },
              horzLines: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            rightPriceScale: {
              visible: false
            },
            timeScale: {
              visible: true,
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          });

          const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
              type: 'volume',
            },
          });

          volumeSeries.setData(volumeData);
          return () => chart.remove();
        }
      }, [volumeData]);

      return (
        <>
          <div className="volume-chart-container">
            <h3>60m Trading Volume</h3>
            <div ref={chartRef} className="volume-chart" />
          </div>
          <div className="volume-info-box">
            <h3>Chart Information</h3>
            <div className="info-section">
              <h4>Data Source</h4>
              <p>Real-time data from Binance API. Trading volume is displayed in USD value.</p>
            </div>
            <div className="info-section">
              <h4>Chart Details</h4>
              <p>Chart type: Histogram showing volume distribution.</p>
              <p>Time frame: 1-minute candles over the last 60 minutes.</p>
              <p>Green bars indicate price increase, red bars indicate price decrease during the period.</p>
            </div>
            <div className="info-section">
              <h4>Update Frequency</h4>
               <p>Data refreshes every {updateInterval/1000} seconds.</p>
              <p>Timer settings are adjustable via chart controls.</p>
              <p>Updates are synchronized with the price chart.</p>
            </div>
          </div>
        </>
      );
    };

    export default VolumeChart;
