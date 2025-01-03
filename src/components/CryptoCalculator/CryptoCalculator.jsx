import React, { useState, useEffect } from 'react';
    import './CryptoCalculator.css';

    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4, useGrouping: false }).format(num);
    };

    const CryptoCalculator = () => {
      const [selectedCrypto, setSelectedCrypto] = useState(null);
      const [investmentAmount, setInvestmentAmount] = useState('');
      const [initialCryptoPrice, setInitialCryptoPrice] = useState('');
      const [sellingCryptoPrice, setSellingCryptoPrice] = useState('');
      const [profit, setProfit] = useState(null);
      const [total, setTotal] = useState(null);
      const [byUnit, setByUnit] = useState(false);
      const [error, setError] = useState(null);
      const [cryptoPrices, setCryptoPrices] = useState({});
      const [leverage, setLeverage] = useState(1);
      const [showBnfcrProfit, setShowBnfcrProfit] = useState(false);
      const [bnfcrProfit, setBnfcrProfit] = useState(null);
      const [bnfcrTotal, setBnfcrTotal] = useState(null);

      const cryptoOptions = [
        { value: 'BTC', label: 'Bitcoin (BTC)' },
        { value: 'ETH', label: 'Ethereum (ETH)' },
        { value: 'BNB', label: 'Binance Coin (BNB)' },
        { value: 'XRP', label: 'Ripple (XRP)' },
        { value: 'ADA', label: 'Cardano (ADA)' },
        { value: 'SOL', label: 'Solana (SOL)' },
        { value: 'DOGE', label: 'Dogecoin (DOGE)' },
        { value: 'TRX', label: 'TRON (TRX)' },
        { value: 'DOT', label: 'Polkadot (DOT)' },
        { value: 'LTC', label: 'Litecoin (LTC)' },
        { value: 'MATIC', label: 'Polygon (MATIC)' },
        { value: 'APE', label: 'ApeCoin (APE)' },
      ];

      useEffect(() => {
        const fetchPrices = async () => {
          try {
            const prices = {};
            for (const option of cryptoOptions) {
              let symbol = `${option.value}USDT`;
              const response = await fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${symbol}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              prices[option.value] = data.price;
            }
            setCryptoPrices(prices);
          } catch (err) {
            setError('Failed to fetch crypto prices');
          }
        };

        fetchPrices();
      }, []);

      useEffect(() => {
        if (selectedCrypto && cryptoPrices[selectedCrypto]) {
          setInitialCryptoPrice(formatNumber(cryptoPrices[selectedCrypto]));
          const randomPercentage = Math.random() * (0.05 - 0.01) + 0.01;
          const sellingPrice = parseFloat(cryptoPrices[selectedCrypto]) * (1 + randomPercentage);
          setSellingCryptoPrice(formatNumber(sellingPrice));
        }
      }, [selectedCrypto, cryptoPrices]);

      useEffect(() => {
        calculateProfit();
      }, [investmentAmount, initialCryptoPrice, sellingCryptoPrice, byUnit, leverage, showBnfcrProfit]);

      const calculateProfit = () => {
        if (!investmentAmount || !initialCryptoPrice || !sellingCryptoPrice) {
          setProfit(null);
          setTotal(null);
          setBnfcrProfit(null);
          setBnfcrTotal(null);
          return;
        }

        setError(null);

        const investment = parseFloat(investmentAmount);
        const initialPrice = parseFloat(initialCryptoPrice);
        const sellingPrice = parseFloat(sellingCryptoPrice);
        const leverageMultiplier = parseFloat(leverage);
        const bnfcrValue = 0.1; // 1 BNFCR = $0.1 in fee reduction

        let cryptoUnits;
        if (byUnit) {
          cryptoUnits = investment;
        } else {
          cryptoUnits = investment / initialPrice;
        }

        const calculatedProfit = ((cryptoUnits * sellingPrice) - (byUnit ? 0 : investment)) * leverageMultiplier;
        const calculatedTotal = (byUnit ? 0 : investment) + Math.abs(calculatedProfit);

        setProfit(formatNumber(Math.abs(calculatedProfit)));
        setTotal(formatNumber(calculatedTotal));

        // Calculate profit in BNFCR
        const calculatedBnfcrProfit = Math.abs(calculatedProfit) / bnfcrValue;
        const calculatedBnfcrTotal = calculatedTotal / bnfcrValue;

        setBnfcrProfit(formatNumber(calculatedBnfcrProfit));
        setBnfcrTotal(formatNumber(calculatedBnfcrTotal));
      };

      const handleByUnitToggle = () => {
        setByUnit(!byUnit);
      };

      const handleCryptoSelect = (crypto) => {
        setSelectedCrypto(crypto);
      };

      const handleLeverageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1 && value <= 125) {
          setLeverage(value);
        }
      };

      const handleToggleBnfcrProfit = () => {
        setShowBnfcrProfit(!showBnfcrProfit);
      };

      return (
        <div className="calculator-container">
          <div className="calculator-frame">
            <h2 style={{display: 'none'}}>Crypto Profit Calculator</h2>
            {error && <p>Error: {error}</p>}
            <div className="crypto-options">
              <label>Choose cryptocurrency</label>
              {cryptoOptions.map((option) => (
                <button
                  key={option.value}
                  className={`crypto-button ${selectedCrypto === option.value ? 'selected' : ''}`}
                  onClick={() => handleCryptoSelect(option.value)}
                >
                  {option.label}
                  <br />
                  <span className="crypto-price">
                    {cryptoPrices && cryptoPrices[option.value] ? formatNumber(cryptoPrices[option.value]) : 'Loading...'}
                  </span>
                </button>
              ))}
            </div>
            <div className="input-row">
              <div className="input-group investment-group">
                <label>
                  Investment:
                  <span style={{ marginLeft: '5px' }}>
                    <label className="switch">
                      <input type="checkbox" checked={byUnit} onChange={handleByUnitToggle} />
                      <span className="slider round"></span>
                    </label>
                    <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>By Unit</span>
                  </span>
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={byUnit ? 'Enter Crypto Units' : 'Enter Fiat Amount'}
                />
              </div>
              <div className="input-group">
                <label>Initial Crypto Price:</label>
                <input
                  type="number"
                  value={initialCryptoPrice}
                  onChange={(e) => setInitialCryptoPrice(e.target.value)}
                  placeholder="Initial Price"
                />
              </div>
              <div className="input-group">
                <label>Selling Crypto Price:</label>
                <input
                  type="number"
                  value={sellingCryptoPrice}
                  onChange={(e) => setSellingCryptoPrice(e.target.value)}
                  placeholder="Selling Price"
                />
              </div>
            </div>
            <div className="input-group">
              <label>Leverage (1x - 125x):</label>
              <input
                type="range"
                min="1"
                max="125"
                value={leverage}
                onChange={handleLeverageChange}
                className="leverage-slider"
              />
              <span className="leverage-value">{leverage}x</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <label style={{marginRight: '10px'}}>Display PNL in BNFCR:</label>
              <label className="switch">
                <input type="checkbox" checked={showBnfcrProfit} onChange={handleToggleBnfcrProfit} />
                <span className="slider round"></span>
              </label>
            </div>
            {profit !== null && !showBnfcrProfit && (
              <div className="result">
                <p>Profit ({profit !== null ? (parseFloat(profit) / parseFloat(investmentAmount) * 100).toFixed(2) : 0}%): ${profit}</p>
                <p>Total: ${total}</p>
              </div>
            )}
            {showBnfcrProfit && bnfcrProfit !== null && (
              <div className="result">
                <p>PNL (BNFCR Equivalent): {bnfcrProfit} BNFCR (Equivalent to ${formatNumber(parseFloat(bnfcrProfit) * 0.1)})</p>
                <p>Total (BNFCR Equivalent): {bnfcrTotal} BNFCR (Equivalent to ${formatNumber(parseFloat(bnfcrTotal) * 0.1)})</p>
              </div>
            )}
            {profit === null && error === null && <p>Loading...</p>}
          </div>
        </div>
      );
    };

    export default CryptoCalculator;
