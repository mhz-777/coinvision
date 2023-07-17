import './App.css'
import Search from './components/Search';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import { useEffect, useState } from 'react';
import btcSVG from './assets/images/trends-btc-svg.svg';
import ethSVG from './assets/images/trends-eth-svg.svg';
import Favorites from './components/Favorites';

const App = () => {

  // user input state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // api status state 
  const [apiStatus, setApiStatus] = useState<string>('');

  // settings menu state
  const [isClicked, setClicked] = useState<boolean>(false);

  // theme choice state (default light)
  const [theme, setTheme] = useState<boolean>(true);

  // currency choice state (default CAD)
  const [currency, setCurrency] = useState<number>(3);

  // site section state
  const [siteSection, setSiteSection] = useState<boolean>(false);

  // function to set site section
  const handleSiteSectionChange = () => {
    setSiteSection((prevState) => !prevState);
  }

  // passdown function for search
  const handleSearchTermChange = (value:string) => {
    setSearchTerm(value);
  }

  // function for settings menu
  const handleMenuClick = () => {
    setClicked(!isClicked);
  }

  // function to round off data to prevent overflow for smaller denominations
  const formatData = (value:string) => {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}


  // state to store trends info
  const [trendsInfo, setTrendsInfo] = useState({
    marketMovement: '',
    btcDominance: '',
    ethDominance: '',
    btcDailyTrend: '',
    ethDailyTrend: ''
  });



  // state to store dynamic welcome message
  const [timeOfDayMessage, setTimeOfDayMessage] = useState('');


  // update state when sections are loaded / switched
  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 0 && currentHour < 12) {
      setTimeOfDayMessage('Good morning.');
    } else if (currentHour >= 12 && currentHour < 18) {
      setTimeOfDayMessage('Good afternoon.');
    } else {
      setTimeOfDayMessage('Good evening.');
    }
  }, [siteSection]);



  // favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // passdown function for storing fav, adds fav, then removes if already present 
  const addFavorite = (searchTerm: string) => {

    const searchTermIndex = favorites.indexOf(searchTerm);

    if (searchTermIndex > -1 ) { 

      const updatedFavorites = [...favorites];
      updatedFavorites.splice(searchTermIndex, 1);
      setFavorites(updatedFavorites);

    } else {

      setFavorites([...favorites, searchTerm]);

    }
  };

  // function to retrieve trend data
  const getTrendData = async () => {

    const trendsURL = 'https://api.coingecko.com/api/v3/global';
    const btcTrendsURL = 'https://api.coingecko.com/api/v3/coins/bitcoin?sparkline=false';
    const ethTrendsURL = 'https://api.coingecko.com/api/v3/coins/ethereum?sparkline=false';
    

    try{

      // fetch data for market trends section
      const response = await fetch(trendsURL);
      const trendsData = await response.json();


      // fetch data for btc + eth 24h activity 
      const btcResponse = await fetch(btcTrendsURL);
      const btcTrendsData = await btcResponse.json();

      const ethResponse = await fetch(ethTrendsURL);
      const ethTrendsData = await ethResponse.json();



      setTrendsInfo ({
        ...trendsInfo,
        marketMovement: trendsData.data.market_cap_change_percentage_24h_usd,
        btcDominance: trendsData.data.market_cap_percentage.btc,
        ethDominance: trendsData.data.market_cap_percentage.eth,
        btcDailyTrend: btcTrendsData.market_data.price_change_percentage_24h,
        ethDailyTrend: ethTrendsData.market_data.price_change_percentage_24h
      });
    } catch (error) {
      console.log('im too lazy to tell u what happened so enjoy');
    }
  }

  // ping api to check status on initial load
  useEffect (()=>{
    const pingAPI = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/ping');
      if(!response.ok) {
        setApiStatus('down');
      }
    };
    pingAPI();
  }, []);


  // fetch data from api and store results
  useEffect (() => {
    getTrendData();
  }, [siteSection]);





  if(apiStatus == 'down') {
    return (
      <section className="api-down-section">
        <h1 className="api-down-message">No connection to API. Please try again later.</h1>
      </section>
    );
  }
  // render results for find section
  else if(siteSection === false){ 
    return (
      <div className="App">
        
        <Navigation siteSection={siteSection}  handleChange={handleSiteSectionChange}/>

        <header className='app-header'>
            <h1 className='site-header'>coinvision.</h1>
            <button className="settings-btn" onClick={handleMenuClick}></button>
            {isClicked && <Settings theme={theme} setTheme={setTheme} currency={currency} setCurrency={setCurrency} isClicked={isClicked} setClicked={setClicked} />}
        </header>
        <main>
          <Search 
            onSearchTermChange={handleSearchTermChange}   
          />
          <h1 className='find-section-header'>{timeOfDayMessage}</h1>
          <section className="trends-information-section">
           {Number(trendsInfo.marketMovement) > 0 && 
            <p className='trends-info'>Markets are <span className='rising-trend'>up</span> {formatData((trendsInfo.marketMovement))}% today.</p>
           }
           {Number(trendsInfo.marketMovement) < 0 && 
            <p className="trends-info">Markets are <span className='falling-trend'>down</span> {formatData((trendsInfo.marketMovement)) * -1}% today.</p>
           }
            
            <p className='trends-info'>Bitcoin dominance at <span className="rising-trend">{formatData((trendsInfo.btcDominance))}%</span></p>
            <p className='trends-info'>Ethereum dominance at <span className="rising-trend">{formatData((trendsInfo.ethDominance))}%</span></p>
          </section>
          <h1 className="find-section-header">Top Coin Activity</h1>
          <section className="trends-coin-activity">
              <div className="coin-activity" id='bitcoin-activity'>
                <div className="coin-image-name-group">
                  <img src={btcSVG} alt="bitcoin" className='coin-activity-image'/>
                  <h1 className="coin-activity-name">Bitcoin</h1>
                </div>
                {Number(trendsInfo.btcDailyTrend) > 0 && 
                  <span className="coin-activity-change coin-activity-uptrend">&#9650;{formatData(trendsInfo.btcDailyTrend)}%</span>
                }
                {Number(trendsInfo.btcDailyTrend) <= 0 && 
                  <span className="coin-activity-change coin-activity-downtrend">&#9660;{formatData(trendsInfo.btcDailyTrend)}%</span>
                } 

              </div>
              <div className="coin-activity">
                <div className="coin-image-name-group">
                  <img src={ethSVG} alt="ethereum" className='coin-activity-image' />
                  <h1 className="coin-activity-name">Ethereum</h1>
                </div>
                {Number(trendsInfo.ethDailyTrend) > 0 &&
                  <span className="coin-activity-change coin-activity-uptrend">&#9650;{formatData(trendsInfo.ethDailyTrend)}%</span>
                }
                {Number(trendsInfo.ethDailyTrend) <= 0 && 
                  <span className="coin-activity-change coin-activity-downtrend">&#9660;{formatData(trendsInfo.ethDailyTrend)}%</span>
                } 
                
              </div>
          </section>
        </main>
      </div>
    );
  // render results for favorites section
  }else if(siteSection === true){
    return (
      <div className="App">
        <header className='app-header'>
            <h1 className='site-header-centered'>coinvision.</h1>
        </header>
        <Navigation siteSection={siteSection}  handleChange={handleSiteSectionChange} />  
        <Favorites />
      </div>
    );
  }

  
}

export default App
