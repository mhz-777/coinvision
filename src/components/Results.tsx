import { useEffect, useState } from 'react';
import './Results.css';
import LoadingIndicator from './LoadingIndicator';
import hyperlinkSVG from '../assets/images/hyperlink-svg.svg';
import errorSVG from '../assets/images/errorsvgtriangle.svg';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis} from 'recharts';


interface resultProps {
    searchTerm: string;
    currency: string;
    favorites: string[];
    addFavorite: (value:string) => void;
}

const Results: React.FC<resultProps> = ( {searchTerm, currency, favorites, addFavorite} ) => {




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
        sparklineData: [] as number[]
    });

    // state to manage loading
    const [isLoading, setLoading] = useState<boolean>(false);

    // state to manage errors
    const [error, setError] = useState<boolean>(false);
    const [validSearch, setValidSearch] = useState<boolean>(false);

    // function to extract important info from URL
    const extractDomain = (url:string) => {

        const pattern = /https?:\/\/([\w.-]+)/;
        const match = url.match(pattern);
        return match ? match[1].replace(/^www\./, '') : null;
    }

    // function to calculate width of dynamic slider
    const calcSliderWidth = () => {

        let currentPrice = coinAttributes.coinPrice;
        let minPrice = coinAttributes.dailyLow;
        let maxPrice = coinAttributes.dailyHigh;

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

    // url based off user query, casts lowercase and removes spaces from query
    let apiURL = `https://api.coingecko.com/api/v3/coins/${searchTerm.toLowerCase().replace(/\s/g, '')}?tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=true`;

    // function to get and set data from user query
    const getCoinData = async () => {

        setLoading(true);

        // Delay function execution for 3 seconds cuz API rate limit
        await new Promise((resolve) => {
        setTimeout(resolve, 10000);
        });

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
        }finally {
            setLoading(false);
        }

    }
    
    // refresh data
    useEffect(()=> {
        getCoinData();
    }, [searchTerm, currency]);


    // charting stuff lol
    const chartData = coinAttributes.sparklineData;
    const formattedChartData = chartData.map((y, index) => ({x: index, y}));
    const graphMinValue = Math.min(...chartData);
    const graphMaxValue = Math.max(...chartData);

    // check if searchTerm exists in favorite array
    const isFavorited = favorites.includes(searchTerm);
    

    if(isLoading === true){
        return (
            <div className="loading-div">
                <LoadingIndicator />
            </div>
        );
    } else if(validSearch === true && isLoading === false) {
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

                <section className="coindata-misc-section">
                    <span className="coindata-misc-info">Rank {coinAttributes.marketcapRank}</span>
                    <a 
                    href={coinAttributes.website} 
                    target='_blank'
                    className="coindata-misc-info" 
                    id='coindata-misc-info-site'>
                        <img src={hyperlinkSVG} alt="hyperlink" className="hyperlink-svg" />
                        {extractDomain(coinAttributes.website)}
                    </a>
                </section>

                <section className="coindata-dynamic-slider">
                    <div className="full-slider">
                        <div className="dynamic-slider" style={{width: `${calcSliderWidth()}%`}}></div>
                    </div>
                    <div className="dynamic-price-headings">
                        <h4>${coinAttributes.dailyLow}</h4>
                        <h4>24H Range</h4>
                        <h4>${coinAttributes.dailyHigh}</h4>
                    </div>
                </section>

                <section className="coindata-trend-graph">
                    <h1 className="trend-graph-header">7 day trend</h1>
                    
                    <ResponsiveContainer width="100%" aspect={2} >
                        <LineChart data={formattedChartData}>
                            <Line type="monotone" dataKey="y" stroke="#ffffff" dot={false} />
                            <XAxis hide={true}/>
                            <YAxis hide={true} domain={[graphMinValue, graphMaxValue]} />
                        </LineChart>
                    </ResponsiveContainer>      
                
                </section>

                <div className="fav-btn-container">
                    <button className="add-favorite-btn" onClick={()=> addFavorite(searchTerm)}>{isFavorited ? 'Favorited' : 'Favorite'}</button>
                </div>   
                

            </section>
        );
    } else {
        return (
            <div className="error-message-container">
                <img src={errorSVG} alt="error triangle" className='errorSVG' />
                <p className="coin404-message">Coin not found.</p>
                <a href="https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0" target="_blank" className='coin404-redirect'>Coin List</a>
            </div>
        );
    }
}


export default Results;