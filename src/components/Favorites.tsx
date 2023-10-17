import { useEffect, useState } from 'react';
import './Favorites.css';
import questionMarkSVG from '../assets/images/questionmark-svg.svg';

interface favoriteProps {
    favorites: string[];
    currency: string;
    handleChange: () => void;
}

const Favorites: React.FC<favoriteProps> = ({favorites, currency, handleChange}) => {

     // state for favorites attributes
    const [favoriteData, setFavoriteData] = useState<any[]>([]);

    // api call for fav data
    const getFavoriteData = async () => {
        const newDataArray: any[] = [];

        for (const favorite of favorites) {
        try {
            const apiUrl = `https://api.coingecko.com/api/v3/coins/${favorite}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
            const response = await fetch(apiUrl);
            const favData = await response.json();
            newDataArray.push({
            coinName: favData.name,
            coinImage: favData.image.small,
            coinPrice: favData.market_data.current_price[currency],
            dailyChange: favData.market_data.price_change_percentage_24h_in_currency[currency],
            });
        } catch (error) {
            console.log('wow!');
        }
        }

        setFavoriteData(newDataArray);
    };
    

    // trigger useEffect for data fetch
    useEffect(() => {
        getFavoriteData()
    }, [favorites])

    if(favorites.length === 0) {
        return (
            <div className="no-favorites-container">

                <header className="no-favorites-header">
                    <h1 className="fav-heading">coinvision.</h1>
                    <div className="return-btn-container">
                        <button className="return-btn" onClick={handleChange}>home</button>
                    </div>
                </header>
                
                <div className="no-favorites-message">
                    <img src={questionMarkSVG} alt="question mark" className='questionMarkSVG' />
                    <h3 className="no-favorites-header">No favorites to show.</h3>
                </div>
            </div>
            
        )
    } else {
        return (
            <div className="favorites-container">

                <header className="favorites-header">
                    <h1 className="fav-heading">coinvision.</h1>
                    <div className="return-btn-container">
                        <button className="return-btn" onClick={handleChange}>home</button>
                    </div>
                </header>
    
                {favoriteData.map((data, index) => (
                    <div className="user-favorite-container" key={index}>
                        <div className="user-favorite" >
                            <div className="favdata-nameprice-container">
                                <img src={data.coinImage} alt="coin" className='favdata-image'/>
                                <div className="favdata-nameprice-group">
                                    <h1 className="favdata-name">{data.coinName}</h1>
                                    <h2 className="favdata-price">{currency.toUpperCase()} ${data.coinPrice}</h2>
                                </div>
                            </div>
                            {data.dailyChange >= 0 &&
                                <span className="favdata-daily-change favdata-daily-change-positive">&#9650;{(data.dailyChange).toFixed(2)}%</span>
                            }
                            {data.dailyChange < 0 &&
                                <span className="favdata-daily-change favdata-daily-change-negative">&#9660;{(data.dailyChange).toFixed(2)}%</span>
                            }
                        </div>
                    </div>
                    
                ))}
    
            </div>
        );
    
    }

    
}

export default Favorites;