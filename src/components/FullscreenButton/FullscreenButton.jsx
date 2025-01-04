import React, { useState, useEffect } from 'react';
    import './FullscreenButton.css';
    import { FaExpand, FaCompress } from 'react-icons/fa';

    const FullscreenButton = () => {
      const [isFullscreen, setIsFullscreen] = useState(false);

      useEffect(() => {
        const handleFullscreenChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
      }, []);

      const toggleFullscreen = () => {
        if (!isFullscreen) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      };

      return (
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      );
    };

    export default FullscreenButton;
