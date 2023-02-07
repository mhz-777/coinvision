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
        creationDate: '',
        dailyChange: '',
        dailyVolume: ''
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
                creationDate: coinData.genesis_date,
                dailyChange: coinData.market_data.price_change_percentage_24h,
                dailyVolume: coinData.market_data.total_volume.cad
            });
            setValidSearch(true);
        }catch (error) {
            setError(true);
            setValidSearch(false);
        }

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
            <section className="results-section">
                <header className="results-section-header">
                    <section className="header-title-image-group">
                        <img src={coinAttributes.coinImage} alt="coin" className="coin-img" />
                        <h1 className="coin-header">{coinAttributes.coinName}</h1>
                    </section>
                    <h3 className="coin-creation-header">Created: {coinAttributes.creationDate}</h3>
                </header>
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
                        <a href='https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0' target='_blank' className='error-message-link'> here </a> 
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