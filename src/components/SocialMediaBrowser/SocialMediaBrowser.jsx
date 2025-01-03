import React from 'react';
    import './SocialMediaBrowser.css';

    const SocialMediaBrowser = () => {
      const socialMediaPlatforms = [
        {
          name: 'Twitter',
          url: 'https://twitter.com/',
        },
        {
          name: 'Instagram',
          url: 'https://www.instagram.com/',
        },
        {
          name: 'Telegram',
          url: 'https://web.telegram.org/',
        },
        {
          name: 'YouTube',
          url: 'https://www.youtube.com/',
        },
      ];

      return (
        <div className="social-media-browser-container">
          <h2>Social Media</h2>
          <div className="social-media-grid">
            {socialMediaPlatforms.map((platform) => (
              <div key={platform.name} className="social-media-box">
                <h3>{platform.name}</h3>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-media-button"
                >
                  Open {platform.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default SocialMediaBrowser;
