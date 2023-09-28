import { useState } from 'react';
import './Search.css';

interface searchProps {

    onSearchTermChange: (value:string) => void;
    invalidSearch: boolean;
    setInvalidSearch: (value:boolean) => void;
}

const Search: React.FC<searchProps> = ({onSearchTermChange, invalidSearch, setInvalidSearch}) => {

    const [userQuery, setUserQuery] = useState<string>('');
    


    const handleFormSubmit = (event:React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        // prevent empty input
        if(!userQuery) {
            setInvalidSearch(true);
            return;
        }
        
        setInvalidSearch(false);
        onSearchTermChange(userQuery);

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvalidSearch(false);
        setUserQuery(event.target.value);
    }

    return (
        <form className="search-bar" onSubmit={handleFormSubmit}>
            <input 
                type="text"
                value={userQuery}
                onChange={handleChange}
                className='search-input'
            />
            {invalidSearch && <div className='form-error-message'>Please enter a coin name.</div>}
            <button type="submit" className='search-btn'>search</button>
        </form>
    );
}

export default Search;