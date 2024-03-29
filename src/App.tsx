import './App.css'

import Search from './components/Search';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import Favorites from './components/Favorites';
import LoadingIndicator from './components/LoadingIndicator'; 
import Trends from './components/Trends';
import { useEffect, useState } from 'react';
import btcSVG from './assets/images/trends-btc-svg.svg';
import ethSVG from './assets/images/trends-eth-svg.svg';
import Results from './components/Results';



const App = () => {

  // user input state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

  // api status state 
  const [apiStatus, setApiStatus] = useState<string>('');

  // settings menu state
  const [isClicked, setClicked] = useState<boolean>(false);

  // theme choice state (default light)
  const [theme, setTheme] = useState<boolean>(true);

  // currency choice state (default CAD)
  const [currency, setCurrency] = useState<number>(3);

  // initial site loading status
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // site loading status state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // site section state
  const [siteSection, setSiteSection] = useState<string>('landing');

  // function to set site section
  const handleSiteSectionChange = (navChoice:string) => {
    setSiteSection(navChoice);
    setSearchTerm(''); // clear prev search to return to landing
  }

  // passdown function for search
  const handleSearchTermChange = (value:string) => {
    setSearchTerm(value);
  }

  // function for settings menu
  const handleMenuClick = () => {
    setClicked(!isClicked);
  }

  // state for convert currency function
  const [convertedCurrency, setConvertedCurrency] = useState<string>('');

  // function to convert currency to string before passing it as prop
  const convertCurrency = () => {

    if(currency === 3) {
        setConvertedCurrency('cad');
    }else if(currency === 2){
        setConvertedCurrency('usd');
    }else if(currency === 1){
        setConvertedCurrency('aud');
    }else {
        setConvertedCurrency('jpy');
    }
}

  // calls function to refresh data when currency change is detected 
  useEffect(()=> {
    convertCurrency();
  }, [currency])





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

  // wait 2 seconds on initial site load before loading content
  useEffect (() => {

    const delayLoading = () => {
      setTimeout(() => {
        setInitialLoad(false);
      }, 2);
    }
    delayLoading();
  }, []);







  // render error message for error state
  if(apiStatus == 'down') {
    return (
      <section className="api-down-section">
        <h1 className="api-down-message">No connection to API. Please try again later.</h1>
      </section>
    );
  // render loading component when loading
  } else if (initialLoad === true) {
    return (
      <div className="initial-loading-div">
        <LoadingIndicator />
      </div>
    )
  }
  // render results for main app
  else { 
    return (
      <div className="App" style={{backgroundColor: theme ? '#2D2D4F' : '#121212'}}>
        
        <div className="app-container">

          <header className={`app-header ${siteSection === 'favorites' ? 'hidden' : ''}`}>
              <h1 className='site-header'>coinvision.</h1>
              <button className="settings-btn" onClick={handleMenuClick}></button>
              {isClicked && <Settings theme={theme} setTheme={setTheme} currency={currency} setCurrency={setCurrency} isClicked={isClicked} setClicked={setClicked} />}
          </header>
          
          <main>
            {siteSection === 'landing' &&
              <section className="landing">

                   <Search 
                    onSearchTermChange={handleSearchTermChange}
                    invalidSearch={invalidSearch}
                    setInvalidSearch={setInvalidSearch}
                  />

                  {searchTerm === '' &&
                      <Trends 
                        siteSection={siteSection}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                  }

                  {searchTerm != '' &&
                    <Results
                      searchTerm={searchTerm}
                      currency={convertedCurrency}
                      favorites={favorites}
                      addFavorite={addFavorite}
                    />
                  }
              </section>
            }

            {siteSection === 'favorites' &&

                <Favorites
                    favorites={favorites}
                    currency={convertedCurrency}
                   
                />

            }

            {siteSection === 'search' &&

              <section className="search-placeholder">
                  <h1> search something to show results! </h1>
              </section>
            }
                
          </main>
         
        </div>
        
        < Navigation
            onSiteSectionChange={handleSiteSectionChange}
        />
        
      </div>
    );
  }
  
}

export default App
