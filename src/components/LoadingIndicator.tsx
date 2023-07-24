import './LoadingIndicator.css';
import spinner from '../assets/images/loading-spinner.svg';


const LoadingIndicator: React.FC = () => {
    
    return (
        <div className="loading-div-container">
            <img src={spinner} alt="spinner" className='spinner-svg' />
            <h1 className="loading-div-header">fetching data...</h1>
        </div>
    );
}

export default LoadingIndicator;