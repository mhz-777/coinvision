import './Trends.css';
import { useEffect, useState } from 'react';
import btcSVG from '../assets/images/trends-btc-svg.svg';
import ethSVG from '../assets/images/trends-eth-svg.svg';

interface trendProps {

    siteSection: boolean;
    
    isLoading: boolean;
    setIsLoading: (value:boolean) => void;
}

const Trends: React.FC<trendProps> = ({siteSection, setIsLoading}) => {

      // function to retrieve trend data
    const getTrendData = async () => {

        const trendsURL = 'https://api.coingecko.com/api/v3/global';
        const btcTrendsURL = 'https://api.coingecko.com/api/v3/coins/bitcoin?sparkline=false';
        const ethTrendsURL = 'https://api.coingecko.com/api/v3/coins/ethereum?sparkline=false';
        

        try{

        // set loading status to true
        setIsLoading(true);

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
        console.log(error);
        } finally {
        setIsLoading(false);
        
        }
  }

    // state to store trends info
    const [trendsInfo, setTrendsInfo] = useState({
        marketMovement: 0,
        btcDominance: 0,
        ethDominance: 0,
        btcDailyTrend: 0,
        ethDailyTrend: 0
    });

    // fetch data from api and store results
    useEffect(()=> {
        getTrendData();
    }, [siteSection]);



    // state to store dynamic welcome message
    const [timeOfDayMessage, setTimeOfDayMessage] = useState<string>('');

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

    return (
        <section className="trends-information-section-container">
            <h1 className='find-section-header'>{timeOfDayMessage}</h1>
            <section className="trends-information-section">
            {Number(trendsInfo.marketMovement) > 0 && 
            <p className='trends-info'>Markets are <span className='rising-trend'>up</span> {(trendsInfo.marketMovement).toFixed(2)}% today.</p>
            }
            {Number(trendsInfo.marketMovement) < 0 && 
            <p className="trends-info">Markets are <span className='falling-trend'>down</span> {(trendsInfo.marketMovement * -1).toFixed(2)}% today.</p>
            }
            
            <p className='trends-info'>Bitcoin dominance at <span className="rising-trend">{(trendsInfo.btcDominance).toFixed(2)}%</span></p>
            <p className='trends-info'>Ethereum dominance at <span className="rising-trend">{(trendsInfo.ethDominance).toFixed(2)}%</span></p>
            </section>
            <h1 className="find-section-header">Top Coin Activity</h1>
            <section className="trends-coin-activity">
                <div className="coin-activity" id='bitcoin-activity'>
                <div className="coin-image-name-group">
                    <img src={btcSVG} alt="bitcoin" className='coin-activity-image'/>
                    <h1 className="coin-activity-name">Bitcoin</h1>
                </div>
                {Number(trendsInfo.btcDailyTrend) > 0 && 
                    <span className="coin-activity-change coin-activity-uptrend">&#9650;{(trendsInfo.btcDailyTrend).toFixed(2)}%</span>
                }
                {Number(trendsInfo.btcDailyTrend) <= 0 && 
                    <span className="coin-activity-change coin-activity-downtrend">&#9660;{(trendsInfo.btcDailyTrend).toFixed(2)}%</span>
                } 

                </div>
                <div className="coin-activity">
                <div className="coin-image-name-group">
                    <img src={ethSVG} alt="ethereum" className='coin-activity-image' />
                    <h1 className="coin-activity-name">Ethereum</h1>
                </div>
                {Number(trendsInfo.ethDailyTrend) > 0 &&
                    <span className="coin-activity-change coin-activity-uptrend">&#9650;{(trendsInfo.ethDailyTrend).toFixed(2)}%</span>
                }
                {Number(trendsInfo.ethDailyTrend) <= 0 && 
                    <span className="coin-activity-change coin-activity-downtrend">&#9660;{(trendsInfo.ethDailyTrend).toFixed(2)}%</span>
                } 
                </div>
            </section>
      </section>
    );
}

export default Trends;