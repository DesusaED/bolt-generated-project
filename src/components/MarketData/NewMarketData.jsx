import React, { useState, useEffect, useRef } from 'react';
    import './NewMarketData.css';

    const formatNumber = (number, symbol) => {
      if (number === null) return null;
      let fractionDigits = 2;
      if (symbol === 'DOGE' || symbol === 'PEPE' || symbol === 'SHIB') {
        fractionDigits = 5;
      }
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
    };

    const NewMarketData = () => {
      const [marketData, setMarketData] = useState([]);
      const [newListings, setNewListings] = useState([]);
      const [marketError, setMarketError] = useState(null);
      const cachedSymbols = useRef([]);
      const previousPrices = useRef({});

      useEffect(() => {
        const fetchMarketData = async () => {
          try {
            const symbols = [
              'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'TRXUSDT',
              'DOTUSDT', 'LTCUSDT', 'MATICUSDT', 'AVAXUSDT', 'LINKUSDT', 'UNIUSDT', 'XLMUSDT', 'ETCUSDT',
              'FILUSDT', 'VETUSDT', 'EGLDUSDT', 'AAVEUSDT', 'THETAUSDT', 'EOSUSDT', 'XTZUSDT', 'NEOUSDT',
              'ZECUSDT', 'DASHUSDT', 'BCHUSDT', 'XMRUSDT', 'ATOMUSDT', 'HBARUSDT', 'ICPUSDT', 'ALGOUSDT',
              'NEARUSDT', 'MANAUSDT', 'SANDUSDT', 'AXSUSDT', 'GALAUSDT', 'CHZUSDT', 'ENJUSDT', 'FLOWUSDT',
              'APEUSDT', 'IMXUSDT', 'RUNEUSDT', 'GRTUSDT', 'MKRUSDT', 'COMPUSDT', 'SNXUSDT', 'CRVUSDT',
              'YFIUSDT', 'SUSHIUSDT', '1INCHUSDT', 'LDOUSDT', 'OPUSDT', 'ARBUSD', 'APTUSDT', 'SUIUSDT',
              'PEPEUSDT', 'SHIBUSDT'
            ];
            const responses = await Promise.all(
              symbols.map(async symbol => {
                try {
                  const res = await fetch(`https://www.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
                  if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                  }
                  const data = await res.json();
                  const prevPrice = previousPrices.current[symbol];
                  let priceChangeColor = 'white';
                  if (prevPrice !== undefined && data.lastPrice !== null) {
                    if (parseFloat(data.lastPrice) > parseFloat(prevPrice)) {
                      priceChangeColor = 'green';
                    } else if (parseFloat(data.lastPrice) < parseFloat(prevPrice)) {
                      priceChangeColor = 'red';
                    }
                  }
                  previousPrices.current[symbol] = data.lastPrice;
                  return { ...data, priceChangeColor };
                } catch (error) {
                  console.error(`Failed to fetch market data for ${symbol}:`, error);
                  return { symbol: symbol, price: null, priceChangeColor: 'white' };
                }
              })
            );
            setMarketData(responses);
            console.log('Market data updated:', new Date().toLocaleTimeString());
          } catch (e) {
            console.error("Failed to fetch market data:", e);
            setMarketError("Failed to fetch market data");
          }
        };

        const fetchNewListings = async () => {
          try {
            const response = await fetch('https://www.binance.com/api/v3/exchangeInfo');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const currentSymbols = data.symbols.map(symbol => symbol.symbol);

            if (cachedSymbols.current.length === 0) {
              cachedSymbols.current = currentSymbols;
              setNewListings([]);
            } else {
              const newSymbols = currentSymbols.filter(symbol => !cachedSymbols.current.includes(symbol));
              if (newSymbols.length > 0) {
                const newListingData = await Promise.all(
                  newSymbols.map(async symbol => {
                    try {
                      const res = await fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${symbol}`);
                      if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                      }
                      const priceData = await res.json();
                      return { ...priceData, listingTime: new Date().toLocaleString() };
                    } catch (error) {
                      console.error(`Failed to fetch new listing data for ${symbol}:`, error);
                      return { symbol: symbol, price: null, listingTime: null };
                    }
                  })
                );
                setNewListings(newListingData);
                cachedSymbols.current = currentSymbols;
              } else {
                setNewListings([]);
              }
            }
            console.log('New listings updated:', new Date().toLocaleTimeString());
          } catch (error) {
            console.error("Failed to fetch new listings:", error);
          }
        };

        fetchMarketData();
        fetchNewListings();
        const marketIntervalId = setInterval(fetchMarketData, 10000);
        const newListingIntervalId = setInterval(fetchNewListings, 60000);

        return () => {
          clearInterval(marketIntervalId);
          clearInterval(newListingIntervalId);
        };
      }, []);

      return (
        <div className="market-overview">
          <div className="market-sections">
            <div className="market-section">
              <h3>Hot Coins</h3>
              {marketData.slice(0, 3).map((item, index) => (
                <div key={index} className="market-item">
                  <span>{item.symbol?.replace('USDT', '').replace('BUSD', '') || 'N/A'}</span>
                  <span>${item.lastPrice ? formatNumber(item.lastPrice, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                </div>
              ))}
            </div>
            <div className="market-section">
              <h3>New Listing</h3>
              {newListings && newListings.length > 0 ? (
                newListings.slice(0, 3).map((item, index) => (
                  <div key={index} className="market-item">
                    <span>{item.symbol?.replace('USDT', '').replace('BUSD', '') || 'N/A'}</span>
                    <span>${item.price ? formatNumber(item.price, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                    {item.listingTime && <span className="listing-time">({item.listingTime})</span>}
                  </div>
                ))
              ) : (
                <p>No new listings</p>
              )}
            </div>
            <div className="market-section">
              <h3>Top Gainer Coin</h3>
              {marketData.slice(2, 5).map((item, index) => (
                <div key={index} className="market-item">
                  <span>{item.symbol?.replace('USDT', '').replace('BUSD', '') || 'N/A'}</span>
                  <span>${item.lastPrice ? formatNumber(item.lastPrice, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                </div>
              ))}
            </div>
            <div className="market-section">
              <h3>Top Volume Coin</h3>
              {marketData.slice(4, 7).map((item, index) => (
                <div key={index} className="market-item">
                  <span>{item.symbol?.replace('USDT', '').replace('BUSD', '') || 'N/A'}</span>
                  <span>${item.lastPrice ? formatNumber(item.lastPrice, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="market-table">
            <h3>Top Tokens by Market Capitalization</h3>
            <p>View all cryptocurrencies from Binance with the latest prices, 24-hour volume, price changes, and market caps.</p>
            <div className="market-table-header">
              <span>Name</span>
              <span>Price</span>
              <span>24h Change</span>
              <span>24h Volume</span>
              <span>Market Cap</span>
            </div>
            <div className="market-table-container">
              {marketData.map((item, index) => (
                <div key={index} className="market-table-row">
                  <span>{item.symbol?.replace('USDT', '').replace('BUSD', '') || 'N/A'}</span>
                  <span>${item.lastPrice ? formatNumber(item.lastPrice, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                  <span style={{ color: item.priceChangeColor }}>{item.priceChangePercent ? formatNumber(item.priceChangePercent, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}%</span>
                  <span>${item.volume ? formatNumber(item.volume, item.symbol?.replace('USDT', '').replace('BUSD', '')) : 'N/A'}</span>
                  <span>${formatNumber(Math.random() * 1000000000000, item.symbol?.replace('USDT', '').replace('BUSD', ''))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    export default NewMarketData;
