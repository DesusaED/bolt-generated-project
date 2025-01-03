import React from 'react';
    import { useLocation } from 'react-router-dom';
    import { FaBitcoin } from 'react-icons/fa';
    import './Header.css';

    const Header = () => {
      const location = useLocation();
      let headerText = 'Live Tracker';

      if (location.pathname === '/market') {
        headerText = 'Markets Overview';
      } else if (location.pathname === '/calculator') {
        headerText = 'Crypto Calculator';
      } else if (location.pathname === '/currency') {
        headerText = 'Currency Converter';
      }

      return (
        <header className="header">
          <div className="header-content">
            <FaBitcoin />
            <h1>{headerText}</h1>
          </div>
        </header>
      );
    };

    export default Header;
