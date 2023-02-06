import { useState } from 'react';
import './Search.css';

interface searchProps {
    onSearchTermChange: (value:string) => void;
}

const Search: React.FC<searchProps> = ({onSearchTermChange}) => {

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
        onSearchTermChange(userQuery);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvalid('');
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
            {invalid && <div className='form-error-message'>Please enter a coin name.</div>}
            <button type="submit" className='search-btn'>search</button>
        </form>
    );
}

export default Search;