import { useEffect, useState } from 'react';
import './Results.css';
import errorSVG from '../assets/images/errorsvgtriangle.svg';

interface resultProps {
    searchTerm: string;
    isClicked: boolean;
    menuClicked: ()=>void;
}

const Results: React.FC<resultProps> = ({searchTerm, isClicked, menuClicked}) => {

    // state to manage coin attributes
    const [coinAttributes, setCoinAttributes] = useState({
        coinName: '',
        coinImage: '',
        coinPrice: '',
        dailyChange: '',
        ath: '',
        athChangePercent: '',
        marketcapRank: '',
        dailyHigh: '',
        dailyLow: ''
    });

    // state to handle error in query
    const [validSearch, setValidSearch] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // url based off user query
    let apiURL = `https://api.coingecko.com/api/v3/coins/${searchTerm.toLowerCase()}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    // function to get and set data from user query
    const getCoinData = async () => {
        try {
            const response = await fetch(apiURL);
            const coinData = await response.json();
            setCoinAttributes({
                ...coinAttributes,
                coinName: coinData.name,
                coinImage: coinData.image.small,
                coinPrice: coinData.market_data.current_price[currencyChoice],
                dailyChange: coinData.market_data.price_change_percentage_24h_in_currency[currencyChoice],
                ath: coinData.market_data.ath[currencyChoice],
                athChangePercent: coinData.market_data.ath_change_percentage[currencyChoice],
                marketcapRank: coinData.market_data.market_cap_rank,
                dailyHigh: coinData.market_data.high_24h[currencyChoice],
                dailyLow: coinData.market_data.low_24h[currencyChoice]
            });
            setValidSearch(true);
        }catch (error) {
            setError(true);
            setValidSearch(false);
        }

    }

    // function to round off data to prevent overflow for smaller denominations
    const formatData = (value:string) => {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }

    // function to calculate width of the dynamic slider
    const calcSliderWidth = () => {

        // cast values to number type
        let currentPrice = Number(coinAttributes.coinPrice);
        let minPrice = Number(coinAttributes.dailyLow);
        let maxPrice = Number(coinAttributes.dailyHigh);

        // set div width to 0 if price is lower then 24hr low
        if(currentPrice < minPrice) {
            return 0;
        }

        // set div width to 100 if price is higher than 24hr high
        if(currentPrice > maxPrice) {
            return 100;
        }

        return ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
    }

    // state to store theme settings
    const [themeChoice , setThemeChoice] = useState<string>('Light');

    // function to handle change of theme
    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setThemeChoice(event.target.value);
    }

    // state to store currency setting
    const [currencyChoice, setCurrencyChoice] = useState<string>('cad');

    // function to handle change of currency
    const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrencyChoice(event.target.value);
    }

    // get data when searchTerm is updated with value
    useEffect(()=> {
        if(searchTerm != '') {
            getCoinData();
        }
    }, [searchTerm]);

    // render when currency change is selected
    useEffect(()=>{
        if(validSearch === true){
            getCoinData();
        }
    }, [currencyChoice]);


    // render results, otherwise fallback to placeholder
    if(searchTerm && validSearch === true) {
        return (
            <section className="results-section-container">
                <header className="results-section-header">
                    <section className="header-title-image-group">
                        <img src={coinAttributes.coinImage} alt="coin" className="coin-img" />
                        <h1 className="coin-header">{coinAttributes.coinName}</h1>
                    </section>
                    <section className="header-pricetrend-section">
                        {Number(coinAttributes.dailyChange) > 0 &&
                            <h1 className='header-price-uptrend header-pricetrend'>{formatData(coinAttributes.dailyChange)}%</h1>
                        }
                        {Number(coinAttributes.dailyChange) < 0 &&
                            <h1 className='header-price-downtrend header-pricetrend'>{formatData(coinAttributes.dailyChange) * -1}%</h1>
                        }
                        {Number(coinAttributes.dailyChange) == 0 &&
                            <h1 className='header-price-neutral header-pricetrend'>{formatData(coinAttributes.dailyChange)}%</h1>
                        }
                    </section>
                </header>
                <section className="dynamic-price-slider">
                    <div className="full-slider">
                        <div className="dynamic-slider" style={{width: `${calcSliderWidth()}%`}}></div>
                    </div>
                    <div className="dynamic-price-headings">
                        <h4>${coinAttributes.dailyLow}</h4>
                        <h4>24H Range</h4>
                        <h4>${coinAttributes.dailyHigh}</h4>
                    </div>
                </section>
                <section className="results-section-data">
                        <div className="current-price results-div">
                            <h2 className="results-heading">current price</h2>
                            <h1 className="results-data">{currencyChoice.toUpperCase()} ${coinAttributes.coinPrice}</h1>
                        </div>
                        <div className="ath results-div">
                            <h2 className="results-heading">all time high (ATH)</h2>
                            <h1 className="results-data" id='results-data-ath'>
                            {currencyChoice.toUpperCase()} ${coinAttributes.ath}
                                {Number(coinAttributes.athChangePercent) < 0 && 
                                    <span className="ath-percentage-change" id='negative-ath'>&#9660;{formatData(coinAttributes.athChangePercent) * -1}%</span>
                                }
                                {Number(coinAttributes.athChangePercent) > 0 && 
                                    <span className="ath-percentage-change" id='positive-ath'>&#9650;{formatData(coinAttributes.athChangePercent)}%</span>
                                }
                            </h1>
                        </div>
                        <div className="marketcap-rank results-div">
                            <h2 className="results-heading">marketcap rank</h2>
                            <h1 className="results-data">{coinAttributes.marketcapRank}</h1>
                        </div>
                </section>
                
                <div className={isClicked ? 'dropdown-settings' : 'dropdown-settings-hidden'}>
                    <h1 className="settings-header">settings</h1>
                    <div className="theme-settings">
                        <label htmlFor="theme">theme</label>
                        <select name="theme" id="results-section-theme" onChange={handleThemeChange} value={themeChoice}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                        </div>
                    <div className="currency-settings">
                        <label htmlFor="currency">currency</label>
                        <select name="currency" id="results-section-currency" onChange={handleCurrencyChange} value={currencyChoice}>
                            <option value="aud">AUD</option>
                            <option value="cad">CAD</option>
                            <option value="jpy">JPY</option>
                            <option value="usd">USD</option>
                        </select>
                    </div>
                    <button className="close-settings-btn" onClick={menuClicked}></button>
                </div>
                
                
            </section>
        );
    }else if(error === true){
        return (
            <section className="results-section-error">
                <section className="error-message-container">
                    <img src={errorSVG} alt="error triangle" className='errorsvg-img'/>
                    <h1 className="error-message-heading">Coin not found.</h1>
                    <p className="error-message-desc">
                        Click 
                        <a href='https://api.coingecko.com/api/v3/coins/list' target='_blank' className='error-message-link'> here </a> 
                        to be redirected to the API coins list, and then try again.
                    </p>
                    <p className="error-message-desc">
                        Be sure to enter the ID (API ID) rather then the symbol or name.
                    </p>
                </section>
            </section>
        );
    }else if(isClicked === true){
        return (
            <section className="results-section-settings">
                <h1 className="settings-header">settings</h1>
                <div className="theme-settings">
                    <label htmlFor="theme">theme</label>
                    <select name="theme" id="results-section-theme" onChange={handleThemeChange} value={themeChoice}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="currency-settings">
                    <label htmlFor="currency">currency</label>
                    <select name="currency" id="results-section-currency" onChange={handleCurrencyChange} value={currencyChoice}>
                        <option value="aud">AUD</option>
                        <option value="cad">CAD</option>
                        <option value="jpy">JPY</option>
                        <option value="usd">USD</option>
                    </select>
                </div>
            </section>
        )
    }
    else {
        return (
            <section className="results-section-placeholder">
                <h1 className="results-placeholder-heading">Enter a coin above to retrieve data.</h1>
            </section>
        );
    }
    
}

export default Results;