import './App.css'
import Search from './components/Search';
import Results from './components/Results';
import { useEffect, useState } from 'react';

function App() {

  // user input state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // api data
  const [apiData, setApiData] = useState<string>('');

  // passdown function for search
  const handleSearchTermChange = (value:string) => {
    setSearchTerm(value);
  }

  // ping api to check status on initial load
  useEffect (()=>{
    const pingAPI = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/ping');
      if(!response.ok) {
        setApiData('down');
      }
    };
    pingAPI();
  }, [])

  return (
    <div className="App">
      <header>
          <h1 className='site-header'>coinvision.</h1>
          <button className="settings-btn"></button>
      </header>
      <main>
        <Search 
          onSearchTermChange={handleSearchTermChange}   
        />
        <Results
          searchTerm={searchTerm}
        />
        <footer className="main-sec-footer">
          <p className="api-status-header">api status:</p>
          {apiData != 'down' &&
            <div className="api-operational"></div>
          }
          {apiData == 'down' &&
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
