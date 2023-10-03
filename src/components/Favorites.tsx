import './Favorites.css';

interface favoriteProps {
    favorites: string[];
}

const Favorites: React.FC<favoriteProps> = ({favorites}) => {

    return (
        <div className="favorites-container">
            
            
            <p>{favorites}</p>
        </div>
    );

}

export default Favorites;