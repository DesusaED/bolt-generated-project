import React, { useState, useEffect } from 'react';
    import './AffiliateLinks.css';
    import ScrollingText from '../ScrollingText/ScrollingText';

    const AffiliateLinks = () => {
      const [currentLinkIndex1, setCurrentLinkIndex1] = useState(0);
      const [currentLinkIndex2, setCurrentLinkIndex2] = useState(0);
      const affiliateItems1 = [
        {
          title: "Binance",
          description: "World's largest crypto exchange",
          link: "https://www.binance.com/activity/referral-entry/CPA?ref=CPA_002K0F6N1Y",
          icon: "🪙"
        },
        {
          title: "Nagano Tonic",
          description: "Loss Much More",
          link: "https://9b95c7q9qfig2335gepkub4ybv.hop.clickbank.net",
          icon: "✨"
        },
        {
          title: "FX trading",
          description: "Climber System",
          link: "https://bddb3ck9-dkeq7bq3m9dke5o2y.hop.clickbank.net",
          icon: "💹"
        },
         {
          title: "The Genius Wave",
          description: "Neuroscientist-endor",
          link: "https://75882iok1etnr6fcqjssxa5n3d.hop.clickbank.net",
          icon: "🧠"
        },
        {
          title: "MITOLYN",
          description: "Unlock Your Power",
          link: "https://d22799pd-6ubxvaauh3e0e5o4u.hop.clickbank.net",
          icon: "⚡"
        },
        {
          title: "Vip Indicators",
          description: "Ai POWERED",
          link: "https://fa6c4aokv7ud-ufb48s9ok2r7n.hop.clickbank.net",
          icon: "🤖"
        }
      ];
      const affiliateItems2 = [
        {
          title: "Think and Grow Rich",
          description: "Granddadd of Literature",
          link: "https://amzn.to/4gH0syw",
          icon: "🧠"
        },
        {
          title: "The Art Of War",
          description: "Strategy History",
          link: "https://amzn.to/3DEF527",
          icon: "⚔️"
        },
        {
          title: "Crypto Wallet",
          description: "Protecting Bitcoin & 1000's",
          link: "https://amzn.to/4a2fY5d",
          icon: "🔒"
        },
        {
          title: "Broken Money",
          description: "Why Our Financial",
          link: "https://amzn.to/4fK7Mb4",
          icon: "💰"
        },
        {
          title: "Meditations",
          description: "find something useful",
          link: "https://amzn.to/4fLBKvo",
          icon: "🧘"
        },
        {
          title: "The Intelligent Investor",
          description: "timeless wisdom",
          link: "https://amzn.to/401IcbE",
          icon: "🧐"
        },
         {
          title: "How to Day Trade",
          description: "A Beginner’s Guide",
          link: "https://amzn.to/4gF8g3M",
          icon: "📈"
        },
        {
          title: "Electric Pressure Washer",
          description: "Power Washer",
          link: "https://amzn.to/4iWGLnK",
          icon: "🚿"
        },
        {
          title: "Ledger Nano S Plus",
          description: "All Your Crypto",
          link: "https://amzn.to/41Xzazo",
          icon: "🔑"
        },
         {
          title: "Ripple XRP",
          description: "Money Gift T",
          link: "https://amzn.to/3Pf3FZY",
          icon: "💱"
        },
        {
          title: "Direct Contact",
          description: "COMIC BOOK",
          link: "https://amzn.to/4gZDIZY",
          icon: "📚"
        }
      ];

      const staticAffiliateItems = [
        {
          title: "PC Game",
          description: "DIRECT CONTACT",
          link: "https://store.steampowered.com/app/2084450/DIRECT_CONTACT/",
          icon: "🎮"
        }
      ];

      const scrollingText = `<span class="book-name">Think and Grow Rich</span>  Thoughts are things, and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches, or other material objects. <span class="book-name">The 7 Habits of Highly Effective People</span>  Begin with the end in mind. <span class="book-name">Think and Grow Rich</span>  Whatever the mind of man can conceive and believe, it can achieve. <span class="book-name">The Art of War</span>  The supreme art of war is to subdue the enemy without fighting. <span class="book-name">Think and Grow Rich</span>  The starting point of all achievement is desire. <span class="book-name">The 48 Laws of Power</span>  Always say less than necessary. <span class="book-name">Think and Grow Rich</span>  Most great people have attained their greatest success just one step beyond their greatest failure. <span class="book-name">The Art of War</span>  Know yourself and you will win all battles. <span class="book-name">Think and Grow Rich</span>  Patience, persistence and perspiration make an unbeatable combination for success. <span class="book-name">The 48 Laws of Power</span>  So much depends on reputation - guard it with your life. <span class="book-name">Think and Grow Rich</span>  Action is the real measure of intelligence. <span class="book-name">The Art of War</span>  If you know the enemy and know yourself, you need not fear the result of a hundred battles. <span class="book-name">Think and Grow Rich</span>  A goal is a dream with a deadline. <span class="book-name">The 7 Habits of Highly Effective People</span>  Put first things first. <span class="book-name">Think and Grow Rich</span>  Definiteness of purpose is the starting point of all achievement. <span class="book-name">The Art of War</span>  Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt. <span class="book-name">Think and Grow Rich</span>  Organized planning is essential for success. <span class="book-name">The 48 Laws of Power</span>  Use absence to increase respect and honor. <span class="book-name">Think and Grow Rich</span>  The subconscious mind will translate into its physical equivalent, by the most direct and practical method available. <span class="book-name">The Art of War</span>  He will win who knows when to fight and when not to fight. <span class="book-name">Think and Grow Rich</span>  Repetition of affirmation of orders to your subconscious mind is the only known method of voluntary development of the faculty of faith. <span class="book-name">The 7 Habits of Highly Effective People</span>  Seek first to understand, then to be understood. <span class="book-name">Think and Grow Rich</span>  No two minds ever come together without, thereby, creating a third, invisible, intangible force which may be likened to a third mind. <span class="book-name">The Art of War</span>  The art of war teaches us to rely not on the likelihood of the enemy's not coming, but on our own readiness to receive him; not on the chance of his not attacking, but rather on the fact that we have made our position unassailable. <span class="book-name">Think and Grow Rich</span>  Fear is nothing more than a state of mind. <span class="book-name">The 48 Laws of Power</span>  Win through your actions, never through argument. <span class="book-name">Think and Grow Rich</span>  The greatest weakness of all is the great habit of quitting. <span class="book-name">The Art of War</span>  Move not unless you see an advantage; use not your troops unless there is something to be gained; fight not unless the position is critical. <span class="book-name">The 7 Habits of Highly Effective People</span>  Be proactive. <span class="book-name">The Art of War</span>  Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win. <span class="book-name">The 48 Laws of Power</span>  Pose as a friend, work as a spy. <span class="book-name">The Art of War</span>  Opportunities multiply as they are seized. <span class="book-name">The Art of War</span>  To know your enemy, you must become your enemy.`;

      useEffect(() => {
        const intervalId1 = setInterval(() => {
          setCurrentLinkIndex1((prevIndex) => (prevIndex + 1) % affiliateItems1.length);
        }, 5000);

        return () => clearInterval(intervalId1);
      }, [affiliateItems1.length]);

      useEffect(() => {
        const intervalId2 = setInterval(() => {
          setCurrentLinkIndex2((prevIndex) => (prevIndex + 1) % affiliateItems2.length);
        }, 7000);

        return () => clearInterval(intervalId2);
      }, [affiliateItems2.length]);

      const currentItem1 = affiliateItems1[currentLinkIndex1];
      const currentItem2 = affiliateItems2[currentLinkIndex2];

      return (
        <div>
          <div className="scrolling-text-frame">
            <ScrollingText text={scrollingText} />
          </div>
          <div className="affiliate-container">
            <a
              key={`static-0`}
              href={currentItem1.link}
              target="_blank"
              rel="noopener noreferrer"
              className="affiliate-card affiliate-button static-button"
              data-label="Button 1"
            >
              <span className="affiliate-icon">{currentItem1.icon}</span>
              <span>{currentItem1.title}</span>
              <span>{currentItem1.description}</span>
            </a>
            <a
              href={currentItem2.link}
              target="_blank"
              rel="noopener noreferrer"
              className="affiliate-card affiliate-button rotating-button"
              data-label="Button 2"
            >
              <span className="affiliate-icon">{currentItem2.icon}</span>
              <span>{currentItem2.title}</span>
              <span>{currentItem2.description}</span>
            </a>
            <a
              key={`static-1`}
              href={staticAffiliateItems[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="affiliate-card affiliate-button static-button"
              data-label="Button 3"
            >
              <span className="affiliate-icon">{staticAffiliateItems[0].icon}</span>
              <span>{staticAffiliateItems[0].title}</span>
              <span>{staticAffiliateItems[0].description}</span>
            </a>
          </div>
        </div>
      );
    };

    export default AffiliateLinks;
