import React from 'react';
    import './ScrollingText.css';

    const ScrollingText = ({ text }) => {
      return (
        <div className="scrolling-text-container">
          <div className="scrolling-text">
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        </div>
      );
    };

    export default ScrollingText;
