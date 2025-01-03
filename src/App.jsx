import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
    import BitcoinPricePage from './pages/BitcoinPricePage';
    import MarketDataPage from './pages/MarketDataPage';
    import CryptoCalculatorPage from './pages/CryptoCalculatorPage';
    import CurrencyCalculatorPage from './pages/CurrencyCalculatorPage';
    import Header from './components/Header';
    import './App.css';

    function App() {
      return (
        <Router>
          <div className="fixed-elements">
            <nav className="nav-frame">
              <div className="nav-buttons">
                <Link to="/bitcoin" className="nav-button">Bitcoin Price</Link>
                <Link to="/market" className="nav-button">Market Data</Link>
                <Link to="/calculator" className="nav-button">Crypto Calculator</Link>
                <Link to="/currency" className="nav-button">Currency Calculator</Link>
              </div>
            </nav>
            <Header />
          </div>
          
          <div className="app-container">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/bitcoin" />} />
                <Route path="/bitcoin" element={<BitcoinPricePage />} />
                <Route path="/market" element={<MarketDataPage />} />
                <Route path="/calculator" element={<CryptoCalculatorPage />} />
                <Route path="/currency" element={<CurrencyCalculatorPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      );
    }

    export default App;
