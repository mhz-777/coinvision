import './Favorites.css';

interface favoriteProps {
    favorites: string[];
}

const Favorites: React.FC<favoriteProps> = ({favorites}) => {

    return (
        <div className="test">
            <h1>I am a loser.</h1>
            <p>{favorites}</p>
        </div>
    );

}

export default Favorites;