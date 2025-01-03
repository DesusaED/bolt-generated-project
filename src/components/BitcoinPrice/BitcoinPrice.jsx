import React, { useState, useEffect } from 'react';
    import './BitcoinPrice.css';
    import VolumeChart from '../VolumeChart/VolumeChart';
    import PopupChart from '../PopupChart/PopupChart';
    import { FaChartLine } from 'react-icons/fa';

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num);
    };

    const BitcoinPrice = ({ updateInterval, selectedSymbol }) => {
      const [price, setPrice] = useState(null);
      const [priceChange, setPriceChange] = useState(null);
      const [low24h, setLow24h] = useState(null);
      const [high24h, setHigh24h] = useState(null);
      const [volume24h, setVolume24h] = useState(null);
      const [marketCap, setMarketCap] = useState(null);
      const [circulatingSupply, setCirculatingSupply] = useState(null);
      const [error, setError] = useState(null);
      const [symbolName, setSymbolName] = useState('BTC');
      const [isPopupOpen, setIsPopupOpen] = useState(false);

      useEffect(() => {
        console.log('BitcoinPrice useEffect triggered with selectedSymbol:', selectedSymbol);

        const fetchPrice = async () => {
          try {
            const response = await fetch(
              `https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedSymbol}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPrice(data.lastPrice);
            setPriceChange(data.priceChangePercent);
            setLow24h(data.lowPrice);
            setHigh24h(data.highPrice);
            setVolume24h(data.volume);
            setSymbolName(data.symbol.replace('USDT', ''));

            try {
              const exchangeInfoResponse = await fetch(
                `https://api.binance.com/api/v3/exchangeInfo?symbol=${selectedSymbol}`
              );
              if (exchangeInfoResponse.ok) {
                const exchangeInfoData = await exchangeInfoResponse.json();
                const symbolInfo = exchangeInfoData.symbols[0];
                if (symbolInfo) {
                  const totalSupply = symbolInfo.quoteAsset === 'USDT' ? symbolInfo.baseAssetPrecision : symbolInfo.quoteAssetPrecision;
                  const calculatedMarketCap = parseFloat(data.lastPrice) * (10 ** totalSupply);
                  setMarketCap(calculatedMarketCap);
                  setCirculatingSupply(10 ** totalSupply);
                } else {
                  console.error('Symbol info not found in exchange info data');
                  setMarketCap(null);
                  setCirculatingSupply(null);
                }
              } else {
                console.error(
                  'Failed to fetch exchange info from Binance API', exchangeInfoResponse.status
                );
                setMarketCap(null);
                setCirculatingSupply(null);
              }
            } catch (error) {
              console.error('Error fetching from Binance API:', error);
              setMarketCap(null);
              setCirculatingSupply(null);
            }

            setError(null);
            console.log(`${selectedSymbol} price updated:`, new Date().toLocaleTimeString());
          } catch (err) {
            console.error(`Failed to fetch ${selectedSymbol} price:`, err);
            setError(`Failed to fetch ${selectedSymbol} price`);
            setPrice(0);
            setMarketCap(null);
            setCirculatingSupply(null);
          }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, updateInterval);

        return () => clearInterval(interval);
      }, [updateInterval, selectedSymbol]);

      const calculateProgress = () => {
        if (low24h === null || high24h === null || price === null) return 0;
        const range = high24h - low24h;
        if (range === 0) return 0;
        const progress = ((price - low24h) / range) * 100;
        return Math.min(100, Math.max(0, progress));
      };

      const progress = calculateProgress();

      const openPopup = () => {
        setIsPopupOpen(true);
      };

      const closePopup = () => {
        setIsPopupOpen(false);
      };

      return (
        <div className="bitcoin-price-container">
          <div className="bitcoin-price-header">
            <div className="bitcoin-price-main">
              <h1 className="bitcoin-price-title">{symbolName} Price ({symbolName})</h1>
            </div>
            <div className="bitcoin-price-details">
              <span className="bitcoin-price-usd">
                ${price !== null ? formatNumber(price) : 'N/A'} USD
              </span>
              {priceChange !== null && (
                <span className="bitcoin-price-change">
                  {formatNumber(priceChange)}%
                </span>
              )}
            </div>
          </div>
          <div className="bitcoin-market-info">
            <div className="bitcoin-market-section">
              <h2>{symbolName} Market Information</h2>
              <div className="bitcoin-market-low-high-container">
                <div className="bitcoin-market-low-high-labels">
                  <span className="bitcoin-market-low">Low: ${low24h !== null ? formatNumber(low24h) : 'N/A'}</span>
                  <span className="bitcoin-market-high">High: ${high24h !== null ? formatNumber(high24h) : 'N/A'}</span>
                </div>
                <div className="bitcoin-market-progress-bar">
                  <div className="bitcoin-market-progress" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="bitcoin-market-section btc-market-section-bottom">
              <h2>{symbolName} Market Information</h2>
              <div className="bitcoin-market-grid">
                <div className="bitcoin-market-item">
                  <span>Market Cap</span>
                  <span>${marketCap !== null ? formatNumber(marketCap) : 'N/A'}</span>
                </div>
                <div className="bitcoin-market-item">
                  <span>Volume (24hours)</span>
                  <span>${volume24h !== null ? formatNumber(volume24h) : 'N/A'}</span>
                </div>
                <div className="bitcoin-market-item" style={{ whiteSpace: 'nowrap' }}>
                  <span>Circulation Supply</span>
                  <span>{circulatingSupply !== null ? formatNumber(circulatingSupply) : 'N/A'}</span>
                </div>
              </div>
            </div>
            <VolumeChart updateInterval={updateInterval} selectedSymbol={selectedSymbol} />
          </div>
          {error && <p>Error: {error}</p>}
        </div>
      );
    };

    export default BitcoinPrice;
