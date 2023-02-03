import { useState } from 'react';
import './Search.css';

const Search = () => {

    const [userQuery, setUserQuery] = useState<string>('');
    const [invalid, setInvalid] = useState<string>('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        //prevent empty input
        if(!userQuery) {
            setInvalid('Cannot submit blank!');
            return;
        }

        setInvalid('');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserQuery(event.target.value);
    }

    return (
        <form className="search-bar" onSubmit={handleFormSubmit}>
            <input 
                type="text"
                value={userQuery}
                onChange={handleChange}
                placeholder='Enter a coin name (e.g bitcoin)'
                className='search-input'
            />
            {invalid && <div style={{ color: 'red' }}>{invalid}</div>}
            <button type="submit" className='search-btn'>search</button>
        </form>
    );
}

export default Search;