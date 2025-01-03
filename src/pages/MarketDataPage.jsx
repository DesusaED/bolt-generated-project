import React from 'react';
    import NewMarketData from '../components/MarketData/NewMarketData';
    import { FaBitcoin } from 'react-icons/fa';
    import './MarketDataPage.css';

    const MarketDataPage = () => {
      return (
        <div className="market-data-page">
          <NewMarketData />
        </div>
      );
    };

    export default MarketDataPage;
