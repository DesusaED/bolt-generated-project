import React, { useState } from 'react';
    import CurrencyCalculator from '../components/CurrencyCalculator/CurrencyCalculator';
    import CurrencyChart from '../components/CurrencyChart/CurrencyChart';

    const CurrencyCalculatorPage = () => {
      const [fromCurrency, setFromCurrency] = useState('EUR');
      const [toCurrency, setToCurrency] = useState('NOK');

      const handleCurrencyChange = (from, to) => {
        setFromCurrency(from);
        setToCurrency(to);
      };

      return (
        <div>
          <CurrencyCalculator onCurrencyChange={handleCurrencyChange} />
          <CurrencyChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
        </div>
      );
    };

    export default CurrencyCalculatorPage;
