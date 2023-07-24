import { useEffect, useState } from 'react';
import './Results.css'

interface resultProps {
    searchTerm: string;
    currency: string;
}

const Results: React.FC<resultProps> = ( {searchTerm, currency} ) => {




    // state to manage coin attributes
    const [coinAttributes, setCoinAttributes] = useState({
        coinName: '',
        coinImage: '',
        coinPrice: 0,
        dailyChange: 0,
        website: '',
        marketcapRank: 0,
        dailyHigh: 0,
        dailyLow: 0,
        sparklineData: []
    });

    // state to manage errors
    const [error, setError] = useState<boolean>(false);
    const [validSearch, setValidSearch] = useState<boolean>(false);

    

    // url based off user query
    let apiURL = `https://api.coingecko.com/api/v3/coins/${searchTerm.toLowerCase()}?tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=true`;

    // function to get and set data from user query
    const getCoinData = async () => {
        try {
            const response = await fetch(apiURL);
            const coinData = await response.json();
            setCoinAttributes({
                ...coinAttributes,
                coinName: coinData.name,
                coinImage: coinData.image.small,
                coinPrice: coinData.market_data.current_price[currency],
                dailyChange: coinData.market_data.price_change_percentage_24h_in_currency[currency],
                website: coinData.links.homepage[0],
                marketcapRank: coinData.market_data.market_cap_rank,
                dailyHigh: coinData.market_data.high_24h[currency],
                dailyLow: coinData.market_data.low_24h[currency],
                sparklineData: coinData.market_data.sparkline_7d.price
            });
            setValidSearch(true);
        }catch (error) {
            setValidSearch(false);
            setError(true);
        }

    }

    // refresh data 
    useEffect(()=> {
        getCoinData();
    }, [searchTerm, currency]);

    if(validSearch === true) {
        return (
            <section className="coindata-section">
                <section className="coindata-header-section">
                    <div className="coindata-nameprice-container">
                        <img src={coinAttributes.coinImage} alt="coin" className='coindata-image' />
                        <div className="coindata-nameprice-group">
                            <h1 className="coindata-name">{coinAttributes.coinName}</h1>
                            <h2 className="coindata-price">{currency.toUpperCase()} ${coinAttributes.coinPrice}</h2>
                        </div>
                    </div>
                    {coinAttributes.dailyChange >= 0 && 
                        <span className="coindata-daily-change coindata-daily-change-positive">&#9650;{(coinAttributes.dailyChange).toFixed(2)}%</span>
                    }
                    {coinAttributes.dailyChange < 0 &&
                        <span className="coindata-daily-change coindata-daily-change-negative">&#9660;{(coinAttributes.dailyChange).toFixed(2)}%</span>
                    }
                    
                </section>
            </section>
        );
    }else {
        return (
            <h1>wow</h1>
        );
    }
}


export default Results;