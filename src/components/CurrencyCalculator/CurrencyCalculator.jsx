import React, { useState, useEffect } from 'react';
    import './CurrencyCalculator.css';

    const CurrencyCalculator = ({ onCurrencyChange }) => {
      const [fromCurrency, setFromCurrency] = useState('EUR');
      const [toCurrency, setToCurrency] = useState('NOK');
      const [amount, setAmount] = useState('');
      const [convertedAmount, setConvertedAmount] = useState('');
      const [exchangeRates, setExchangeRates] = useState({});
      const [error, setError] = useState(null);

      const currencies = [
        'EUR', 'NOK', 'USD', 'BRL', 'THB', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK', 'DKK', 'INR', 'CNY', 'RUB', 'MXN', 'SGD', 'HKD', 'NZD', 'KRW'
      ];

      useEffect(() => {
        const fetchExchangeRates = async () => {
          try {
            const response = await fetch(
              `https://api.exchangerate-api.com/v4/latest/EUR`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setExchangeRates(data.rates);
            setError(null);
          } catch (err) {
            console.error('Failed to fetch exchange rates:', err);
            setError('Failed to fetch exchange rates');
          }
        };

        fetchExchangeRates();
      }, []);

      useEffect(() => {
        calculateConversion();
      }, [amount, fromCurrency, toCurrency, exchangeRates]);

      const calculateConversion = () => {
        if (!amount || !exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
          setConvertedAmount('');
          return;
        }

        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
        const converted = (parseFloat(amount) / fromRate) * toRate;
        setConvertedAmount(converted.toFixed(2));
      };

      const handleAmountChange = (e) => {
        setAmount(e.target.value);
      };

      const handleFromCurrencyChange = (e) => {
        setFromCurrency(e.target.value);
        onCurrencyChange(e.target.value, toCurrency);
      };

      const handleToCurrencyChange = (e) => {
        setToCurrency(e.target.value);
        onCurrencyChange(fromCurrency, e.target.value);
      };

      return (
        <div className="currency-calculator-container">
          <div className="currency-calculator-frame">
            {error && <p>Error: {error}</p>}
            <div className="input-row">
              <div className="input-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                />
              </div>
              <div className="input-group">
                <label>From:</label>
                <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>To:</label>
                <select value={toCurrency} onChange={handleToCurrencyChange}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {convertedAmount && (
              <div className="result">
                <p>
                  Converted Amount: {convertedAmount} {toCurrency}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    };

    export default CurrencyCalculator;
