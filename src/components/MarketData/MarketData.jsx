import React, { useState, useEffect } from 'react';
    import './MarketData.css';

    const formatNumber = (number, symbol) => {
      if (number === null) return null;
      let fractionDigits = 2;
      if (symbol === 'DOGE' || symbol === 'PEPE') {
        fractionDigits = 5;
      }
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
    };

    const MarketData = () => {
      const [marketData, setMarketData] = useState([]);
      const [marketError, setMarketError] = useState(null);

      useEffect(() => {
        const fetchMarketData = async () => {
          try {
            const symbols = ['ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT'];
            let pepeSymbol = 'PEPEUSDT';
            const pepeCheck = await fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${pepeSymbol}`);
            if (!pepeCheck.ok) {
              pepeSymbol = 'PEPEBUSD';
              const pepeCheckBUSD = await fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${pepeSymbol}`);
              if (!pepeCheckBUSD.ok) {
                pepeSymbol = 'SHIBUSDT';
              }
            }
            const allSymbols = [...symbols, pepeSymbol];
            const responses = await Promise.all(
              allSymbols.map(symbol =>
                fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${symbol}`)
                  .then(res => {
                    if (!res.ok) {
                      throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                  })
              )
            );
            setMarketData(responses);
          } catch (e) {
            console.error("Failed to fetch market data:", e);
            setMarketError("Failed to fetch market data");
          }
        };

        fetchMarketData();
        const marketIntervalId = setInterval(fetchMarketData, 1000);

        return () => {
          clearInterval(marketIntervalId);
        };
      }, []);

      return (
        <div className="market-hud">
          <h2>Market</h2>
          {marketError && <p>Error: {marketError}</p>}
          {marketData.map((item, index) => (
            <div key={index} className="market-item">
              <span>{item.symbol.replace('USDT', '').replace('BUSD', '')}:</span>
              <span>${formatNumber(item.price, item.symbol.replace('USDT', '').replace('BUSD', ''))}</span>
            </div>
          ))}
        </div>
      );
    };

    export default MarketData;
