import './App.css'
import Search from './components/Search';
import Results from './components/Results';
import { useEffect, useState } from 'react';

function App() {

  // user input state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // api status state 
  const [apiStatus, setApiStatus] = useState<string>('');

  // settings menu state
  const [isClicked, setClicked] = useState<boolean>(false);

  // passdown function for search
  const handleSearchTermChange = (value:string) => {
    setSearchTerm(value);
  }

  //function for settings menu
  const handleMenuClick = () => {
    setClicked(!isClicked);
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

  return (
    <div className="App">
      <header>
          <h1 className='site-header'>coinvision.</h1>
          <button className="settings-btn" onClick={handleMenuClick}></button>
      </header>
      <main>
        <Search 
          onSearchTermChange={handleSearchTermChange}   
        />
        <Results
          searchTerm={searchTerm}
          isClicked={isClicked}
          menuClicked={handleMenuClick}
        />
        <footer className="main-sec-footer">
          <p className="api-status-header">api status:</p>
          {apiStatus != 'down' &&
            <div className="api-operational"></div>
          }
          {apiStatus == 'down' &&
            <div className="api-unoperational"></div>
          }
        </footer>
      </main>
      <footer className="site-footer">
        <a href="https://github.com/mhz-777/coinvision" target='_blank' className="footer-github-link"></a>
      </footer>
    </div>
  )
}

export default App
