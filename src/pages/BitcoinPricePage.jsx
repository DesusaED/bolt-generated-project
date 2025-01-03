import React, { useState } from 'react';
    import BitcoinPrice from '../components/BitcoinPrice/BitcoinPrice';
    import BitcoinChart from '../components/BitcoinChart/BitcoinChart';
    import AffiliateLinks from '../components/AffiliateLinks/AffiliateLinks';
    import SocialMediaBrowser from '../components/SocialMediaBrowser/SocialMediaBrowser';
    import './BitcoinPricePage.css';

    const BitcoinPricePage = () => {
      const [updateInterval, setUpdateInterval] = useState(20000);
      const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

      return (
        <div className="bitcoin-price-page">
          <BitcoinPrice
            updateInterval={updateInterval}
            setUpdateInterval={setUpdateInterval}
            selectedSymbol={selectedSymbol}
          />
          <div className="bitcoin-chart-frame">
            <BitcoinChart
              updateInterval={updateInterval}
              setUpdateInterval={setUpdateInterval}
              setSelectedSymbol={setSelectedSymbol}
            />
            <AffiliateLinks />
            <SocialMediaBrowser />
          </div>
        </div>
      );
    };

    export default BitcoinPricePage;
