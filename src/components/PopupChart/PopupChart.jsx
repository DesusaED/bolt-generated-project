import React, { useState, useEffect, useRef } from 'react';
    import { createChart, CrosshairMode } from 'lightweight-charts';
    import './PopupChart.css';
    import { FaTimes } from 'react-icons/fa';

    const PopupChart = ({ onClose, selectedSymbol }) => {
      const chartContainerRef = useRef(null);
      const [chart, setChart] = useState(null);
      const [chartData, setChartData] = useState([]);
      const [ma11Series, setMa11Series] = useState(null);
      const [ma5Series, setMa5Series] = useState(null);
      const [emaSeries, setEmaSeries] = useState(null);
      const [bollingerSeries, setBollingerSeries] = useState(null);
      const [isMa11Visible, setIsMa11Visible] = useState(false);
      const [isMa5Visible, setIsMa5Visible] = useState(false);
      const [isEmaVisible, setIsEmaVisible] = useState(false);
      const [isBollingerVisible, setIsBollingerVisible] = useState(false);
      const [selectedInterval, setSelectedInterval] = useState('15m');

      const intervalOptions = [
        { label: '1m', value: '1m' },
        { label: '5m', value: '5m' },
        { label: '15m', value: '15m' },
        { label: '1h', value: '1h' },
        { label: '4h', value: '4h' },
        { label: '1d', value: '1d' },
      ];

      useEffect(() => {
        const fetchChartData = async () => {
          try {
            const response = await fetch(
              `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=${selectedInterval}&limit=100`
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
          } catch (error) {
            console.error('Failed to fetch chart data:', error);
          }
        };

        fetchChartData();
      }, [selectedSymbol, selectedInterval]);

      useEffect(() => {
        if (chartContainerRef.current && chartData.length > 0) {
          const newChart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.offsetWidth - 40,
            height: chartContainerRef.current.offsetHeight - 40,
            layout: {
              background: { color: 'transparent' },
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
          candleSeries.setData(chartData);
          setChart(newChart);

          return () => {
            newChart.remove();
          };
        }
      }, [chartData]);

      const calculateMA = (data, period) => {
        return data.map((item, index, arr) => {
          if (index < period - 1) return { time: item.time, value: null };
          let sum = 0;
          for (let i = index; i > index - period; i--) {
            sum += arr[i].close;
          }
          return { time: item.time, value: sum / period };
        }).filter(item => item.value !== null);
      };

      const calculateEMA = (data, period) => {
        const emaData = [];
        let multiplier = 2 / (period + 1);
        let emaPrev = null;

        data.forEach((item, index) => {
          if (index < period - 1) {
            emaData.push({ time: item.time, value: null });
            return;
          }

          if (emaPrev === null) {
            let sum = 0;
            for (let i = index; i > index - period; i--) {
              sum += data[i].close;
            }
            emaPrev = sum / period;
          } else {
            emaPrev = (item.close - emaPrev) * multiplier + emaPrev;
          }
          emaData.push({ time: item.time, value: emaPrev });
        });
        return emaData.filter(item => item.value !== null);
      };

      const calculateBollingerBands = (data, period, stdDevMultiplier) => {
        const maData = calculateMA(data, period);
        const bbData = data.map((item, index) => {
          if (index < period - 1) return { time: item.time, upper: null, middle: null, lower: null };
          const maValue = maData[index - (period - 1)].value;
          let sum = 0;
          for (let i = index; i > index - period; i--) {
            sum += Math.pow(data[i].close - maValue, 2);
          }
          const stdDev = Math.sqrt(sum / period);
          return {
            time: item.time,
            upper: maValue + stdDev * stdDevMultiplier,
            middle: maValue,
            lower: maValue - stdDev * stdDevMultiplier,
          };
        }).filter(item => item.upper !== null);
        return bbData;
      };

      const toggleMA = (period) => {
        if (!chart) return;
        if (period === 11) {
          if (ma11Series) {
            chart.removeSeries(ma11Series);
            setMa11Series(null);
            setIsMa11Visible(false);
          } else {
            const ma11Data = calculateMA(chartData, 11);
            const newMa11Series = chart.addLineSeries({ color: 'orange', lineWidth: 1 });
            newMa11Series.setData(ma11Data);
            setMa11Series(newMa11Series);
            setIsMa11Visible(true);
          }
        } else if (period === 5) {
          if (ma5Series) {
            chart.removeSeries(ma5Series);
            setMa5Series(null);
            setIsMa5Visible(false);
          } else {
            const ma5Data = calculateMA(chartData, 5);
            const newMa5Series = chart.addLineSeries({ color: 'cyan', lineWidth: 1 });
            newMa5Series.setData(ma5Data);
            setMa5Series(newMa5Series);
            setIsMa5Visible(true);
          }
        }
      };

      const toggleEMA = () => {
        if (!chart) return;
        if (emaSeries) {
          chart.removeSeries(emaSeries);
          setEmaSeries(null);
          setIsEmaVisible(false);
        } else {
          const emaData = calculateEMA(chartData, 20);
          const newEmaSeries = chart.addLineSeries({ color: 'yellow', lineWidth: 1 });
          newEmaSeries.setData(emaData);
          setEmaSeries(newEmaSeries);
          setIsEmaVisible(true);
        }
      };

      const toggleBollingerBands = () => {
        if (!chart) return;
        if (bollingerSeries) {
          chart.removeSeries(bollingerSeries.upper);
          chart.removeSeries(bollingerSeries.middle);
          chart.removeSeries(bollingerSeries.lower);
          setBollingerSeries(null);
          setIsBollingerVisible(false);
        } else {
          const bbData = calculateBollingerBands(chartData, 20, 2);
          const upperSeries = chart.addLineSeries({ color: 'purple', lineWidth: 1, lineStyle: 1 });
          const middleSeries = chart.addLineSeries({ color: 'white', lineWidth: 1, lineStyle: 1 });
          const lowerSeries = chart.addLineSeries({ color: 'purple', lineWidth: 1, lineStyle: 1 });
          upperSeries.setData(bbData.map(item => ({ time: item.time, value: item.upper })));
          middleSeries.setData(bbData.map(item => ({ time: item.time, value: item.middle })));
          lowerSeries.setData(bbData.map(item => ({ time: item.time, value: item.lower })));
          setBollingerSeries({ upper: upperSeries, middle: middleSeries, lower: lowerSeries });
          setIsBollingerVisible(true);
        }
      };

      const handleIntervalChange = (interval) => {
        setSelectedInterval(interval);
      };

      return (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="button-frame">
              <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#64ffda', fontSize: '1em' }}>Indicators</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="ma-toggle">
                  <button
                    className={`ma-button ${isMa11Visible ? 'active' : ''}`}
                    onClick={() => toggleMA(11)}
                  >
                    <span style={{ textAlign: 'center', display: 'block' }}>MA11</span>
                  </button>
                </div>
                <div className="ma-toggle">
                  <button
                    className={`ma-button ${isMa5Visible ? 'active' : ''}`}
                    onClick={() => toggleMA(5)}
                  >
                    <span style={{ textAlign: 'center', display: 'block' }}>MA5</span>
                  </button>
                </div>
                <div className="ma-toggle">
                  <button
                    className={`ma-button ${isEmaVisible ? 'active' : ''}`}
                    onClick={toggleEMA}
                  >
                    <span style={{ textAlign: 'center', display: 'block' }}>EMA</span>
                  </button>
                </div>
                <div className="ma-toggle">
                  <button
                    className={`ma-button ${isBollingerVisible ? 'active' : ''}`}
                    onClick={toggleBollingerBands}
                  >
                    <span style={{ textAlign: 'center', display: 'block' }}>BB</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="chart-frame-container">
              <div className="chart-frame-inner">
                <div ref={chartContainerRef} className="chart-container" />
              </div>
              <div className="interval-selector-popup">
                {intervalOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`interval-button-popup ${selectedInterval === option.value ? 'active' : ''}`}
                    onClick={() => handleIntervalChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>
      );
    };

    export default PopupChart;
