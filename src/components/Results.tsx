import { useEffect } from 'react';
import './Results.css';

interface resultProps {
    searchTerm: string;
}

const Results: React.FC<resultProps> = ({searchTerm}) => {

    // url based off user query
    let apiURL = `https://api.coingecko.com/api/v3/coins/${searchTerm}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    // function to get data from user query
    const getCoinData = async () => {
        const response = await fetch(apiURL);
        const coinData = await response.json();
        
    }

    // get data when searchTerm is updated with value
    useEffect(()=> {
        if(searchTerm != '') {
            getCoinData();
        }
    }, [searchTerm])

    // render results, otherwise fallback to placeholder
    if(searchTerm) {
        return (
            <section className="results-section">
                <h1>{searchTerm}</h1>
            </section>
        )
    } else {
        return (
            <section className="results-section-placeholder">
                <h1 className="results-placeholder-heading">Enter a coin above to retrieve data.</h1>
            </section>
        )
    }
}

export default Results;