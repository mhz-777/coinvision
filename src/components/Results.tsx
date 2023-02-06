import './Results.css';

interface resultProps {
    searchTerm: string;
}

const Results: React.FC<resultProps> = ({searchTerm}) => {
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