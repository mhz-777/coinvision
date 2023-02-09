import { useEffect, useState } from 'react';
import './Results.css';
import errorSVG from '../assets/images/errorsvgtriangle.svg';

interface resultProps {
    searchTerm: string;
}

const Results: React.FC<resultProps> = ({searchTerm}) => {

    // state to manage coin attributes
    const [coinAttributes, setCoinAttributes] = useState({
        coinName: '',
        coinImage: '',
        coinPrice: '',
        dailyChange: '',
        ath: '',
        marketcapRank: ''
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
                coinPrice: coinData.market_data.current_price.cad,
                dailyChange: coinData.market_data.price_change_percentage_24h,
                ath: coinData.market_data.ath.cad,
                marketcapRank: coinData.market_data.market_cap_rank
            });
            setValidSearch(true);
        }catch (error) {
            setError(true);
            setValidSearch(false);
        }

    }

    const formatData = (value:string) => {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    }

    // get data when searchTerm is updated with value
    useEffect(()=> {
        if(searchTerm != '') {
            getCoinData();
        }
    }, [searchTerm])

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
                <section className="results-section-data">
                        <div className="current-price results-div">
                            <h2 className="results-heading">current price</h2>
                            <h1 className="results-data">${coinAttributes.coinPrice}</h1>
                        </div>
                        <div className="ath results-div">
                            <h2 className="results-heading">all time high (ATH)</h2>
                            <h1 className="results-data">${coinAttributes.ath}</h1>
                        </div>
                        <div className="marketcap-rank results-div">
                            <h2 className="results-heading">marketcap rank</h2>
                            <h1 className="results-data">{coinAttributes.marketcapRank}</h1>
                        </div>
                </section>       
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
    }else {
        return (
            <section className="results-section-placeholder">
                <h1 className="results-placeholder-heading">Enter a coin above to retrieve data.</h1>
            </section>
        );
    }
    
}

export default Results;