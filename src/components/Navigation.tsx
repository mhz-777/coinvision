import './Navigation.css';

interface navigationProps {

    siteSection: boolean;
    handleChange: () => void;

}


const Navigation: React.FC<navigationProps> = ({siteSection, handleChange}) => {




    return (
        <div className="toggle-nav-container">
          <span className='toggle-text'>Find</span>
          <label htmlFor="toggle" className='toggle'>
              <input 
              type="checkbox" 
              name="toggle" 
              id="toggle"
              onChange={handleChange}
              checked={siteSection}
              />
              <span className="slider"></span>
          </label>
          <span className="toggle-text-disabled">Favorites</span>
        </div>
    );
}

export default Navigation;